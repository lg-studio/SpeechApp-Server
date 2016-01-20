var _ = require('underscore');
var Async = require('async');
var ObjectID = require('mongodb').ObjectID;

var log = require('log4js').getLogger('States');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NodeType = require('../Core/Enums').NodeType;

var TaskStateFactory = require('../States/Task/TaskStates').TaskStateFactory;
var logger = require('log4js').getLogger('States');

var AnswerStateType = require('../Core/Enums').AnswerStateType;
var RatingStateType = require('../Core/Enums').RatingStateType;
var RatingType = require('../Core/Enums').RatingType;
var UserLevel = require('../Core/Enums').UserLevel;

var TaskSchema = new Schema({
    PlayerId: Schema.Types.ObjectId,
    //TODO: update with type TaskTemplateSchema
    Template: { type: Schema.Types.Mixed },
    State: { type: Schema.Types.Number },
    TAS: { type: Schema.Types.Mixed },
    TimeStamp: { type: Schema.Types.Mixed },
    Answers: {
        type: [
            {
                Id: Schema.Types.ObjectId
            }
        ]
    },
    Ratings: {
        type: [
            {
                Id: Schema.Types.ObjectId
            }
        ]
    },
    RateesInfo: [{
            UserId: { type: Schema.Types.ObjectId },
            AnswerId: { type: Schema.Types.ObjectId },
            NodeId: { type: Schema.Types.Number }
        }]
});

TaskSchema.methods = {
    FindNodeById : function (nodeId) {
        var node = _.findWhere(this._doc.Template.Nodes, { Id : nodeId });
        return node;
    },
    
    FindRateeInfoByNodeId : function (nodeId) {
        var rateeInfo = _.findWhere(this._doc.RateesInfo, { NodeId : nodeId });
        return rateeInfo;
    },
    
    GetAnswers : function (callback) {
        var answersIdList = GetIdsFromDocArray(this.Answers);
        mongoose.model('Answer').find({ _id: { $in : answersIdList } }).exec(callback);
    },
    
    GetAllRatingsLinkedToAnswers : function (callback) {
        var answers = this.Answers;
        
        mongoose.model('Answer').find({ _id: { $in : answers } }).exec(function (err, answers) {
            var answersIds = _.map(answers, function (answer) {
                return answer._id;
            });
            mongoose.model('Rating').find({ AnswerId : { $in: answersIds } }).exec(callback);
        });
    },
    
    GetQuestions : function () {
        var this_ = this;
        var nodes = _.where(this._doc.Template.Nodes, { Type : NodeType.ContextualOutput });
        var questionNodes = _.map(nodes, function (node) {
            var question = this_.FindNodeById(node.Properties.LinkedNodeId);
            return question;
        });

        return questionNodes;
    },
    
    UpdateStateOfAllAssociatedEntities : function (callback) {
        var task = this;
        logger.debug('\n>>>>>>> Update All Entities task.id: ' + task._id.toString());
        Async.series([
            function (taskCallback) {
                task.GetAllRatingsLinkedToAnswers(function (err, ratings) {
                    Async.eachSeries(ratings, function (rating, cb) {
                        rating.UpdateState(cb);
                    }, taskCallback);
                });
            },
            function (taskCallback) {
                task.GetAnswers(function (err, answers) {
                    Async.eachSeries(answers, function (answer, cb) {
                        answer.UpdateState(cb);
                    }, taskCallback);
                });
            },
            function (taskCallback) {
                task.UpdateState(taskCallback);
            }
        ], callback);

    },
    
    HandleInput: function (taskInput, loggedUserId, handelInputCallback) {
        var task = this;
        Async.series([
            function (callback) {
                HandleAnswersInput(taskInput, task, loggedUserId, callback);
            },
            function (callback) {
                HandleRatingsInput(taskInput, task, loggedUserId, callback);
            }
        ], function (err, results) {
            var ratedAnswersIds = _.map(task.RateesInfo, function (info) {
                return info.AnswerId;
            });
            
            Async.eachSeries(ratedAnswersIds, function (ratedAnswerId, cb) {
                mongoose.model('Answer').findById(ratedAnswerId).exec(function (err, ratedAnswer) {
                    ratedAnswer.GetTaskInstance(function (err, taskOfRatedAnswer) {
                        if (err) {
                            console.log(err.stack);
                            cb(err);
                        }
                        taskOfRatedAnswer.UpdateStateOfAllAssociatedEntities(cb);
                    });
                });
            }, function (err, callback) {
                task.UpdateStateOfAllAssociatedEntities(handelInputCallback);
            });
        });
    },
    
    UpdateRateeInfo : function (answer, callback){
        if (answer) {
            var rateeInfo = {
                UserId: answer.UserId,
                AnswerId: answer._id,
                NodeId: answer.NodeId
            }
            this.RateesInfo.push(rateeInfo);
            this.save(callback);
            return;
        }
        callback(null, this._doc);
    },
    ComputeAverageTas : function (answers) {
        if (answers.length == 0) throw Error("computeWeightedTas Division by 0");
        
        var sumAnswerTAS = 0;
        
        answers.forEach(function (a) {
            sumAnswerTAS += a.TAS;
        });
        //TODO: log if division by 0
        return sumAnswerTAS / answers.length;
    },    
    UpdateState : function (callback) {
        var currentState = TaskStateFactory.Create(this);
        var previousStateType = this.State;
        currentState.UpdateState(function (err, task) {
            var newStateType = task.State;
            logger.debug('\ntask.id: ' + task._id.toString() + '\n State :' + previousStateType + ' -> ' + newStateType);
            if (previousStateType == newStateType) {
                callback(err);
            }
            else {
                task.UpdateState(callback);
            }
        });
    }
}

function HandleAnswersInput(taskInput, task, userId, callback) {
    var answers = taskInput.Answers;
    Async.eachSeries(answers, function (answerInput, cb) {
        var AnswerDAL = mongoose.model('Answer');
        var node = task.FindNodeById(answerInput.NodeId);
        var linkedNodeId = node.Properties.LinkedNodeId;
        
        var answerInstance = new AnswerDAL({
            UserId: userId,
            TaskId: new ObjectID(taskInput.TaskId),
            TaskTemplateId: task._doc.Template._id,
            NodeId: linkedNodeId,
            Recordings : answerInput.FileNames,
            TAS: null,
            State: AnswerStateType.NotRated // New
        });
        //TODO: This could be saved at the end
        answerInstance.save(function (err, answerDoc) {
            task.Answers.push(answerDoc._id);
            task.save(cb);
        });

    }, callback);
}

function ComputeRatingInputMerticsTAS(metrics) {
    var tas = 0;
    _.forEach(metrics, function (metric) {
        tas += metric.Rating;
    });
    tas /= 3;
    return tas;
}

function HandleRatingsInput(taskInput, task, userId, callback) {
    var ratings = taskInput.Ratings;
    mongoose.model('User').findById(userId).exec(function (err, user) {
        Async.eachSeries(ratings, function (ratingInput, cb) {
            var RatingDAL = mongoose.model('Rating');
            
            var node = task.FindNodeById(ratingInput.NodeId);
            var linkedNodeId = node.Properties.LinkedNodeId;
            var rateeInfo = task.FindRateeInfoByNodeId(linkedNodeId);
            
            var tas = ComputeRatingInputMerticsTAS(ratingInput.Metrics);
            mongoose.model('Answer').findById(rateeInfo.AnswerId).exec(function (err, ratedAnswer) {
                var type = RatingType.Regular;
                if (ratedAnswer.State == AnswerStateType.WaitForTieBreaker && 
                    user.Level == UserLevel.Expert) {
                    type = RatingType.TieBreaker;
                }
                
                var ratingInstance = new RatingDAL({
                    RaterId: userId,
                    Type: type,
                    AnswerId: rateeInfo.AnswerId,
                    State: RatingStateType.New,
                    TaskId: new ObjectID(taskInput.TaskId),
                    NodeId: linkedNodeId,
                    Metrics: ratingInput.Metrics,
                    RaterRatingSkillsSnapshot: user.RatingSkills,
                    TAS: tas
                });
                
                ratingInstance.save(function (err, rating) {
                    if (err) {
                        console.log(err.stack);
                    }
                    if (!rating) {
                        console.log("Could not create rating record.");
                    }
                    task.Ratings.push(rating._id);
                    // TODO: this could be saved at the very end of the series
                    task.save(cb);
                })
            });

        }, callback);
    });
}

function GetIdsFromDocArray(docArray) {
    var list = [];
    docArray.forEach(function (element) {
        list.push(element._doc._id);
    });
    return list;
}

mongoose.model("Task", TaskSchema, "Tasks");
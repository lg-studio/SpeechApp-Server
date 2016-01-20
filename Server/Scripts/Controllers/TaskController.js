var _ = require('underscore');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var Async = require('async');
var Config = require('../../Config/Config.global');

var CompileContext = require('../Compiler/Models/CompileContext').CompileContext;
var UserCompileContext = require('../Compiler/Models/UserCompileContext').UserCompileContext;
var RecordingCompileContext = require('../Compiler/Models/RecordingCompileContext').RecordingCompileContext;

var RecordingCollectionCompileContext = require('../Compiler/Models/RecordingCollectionCompileContext').RecordingCollectionCompileContext;

var TaskJsonBuilderMobile = require('../Builders/Mobile/TaskJsonBuilderMobile').TaskJsonBuilderMobile;
var ContextualOutputPropertiesJsonBuilderMobile = require('../Builders/Mobile/ContextualOutputPropertiesJsonBuilderMobile').ContextualOutputPropertiesJsonBuilderMobile;

var AnswerStateType = require('../Core/Enums').AnswerStateType;
var UserLevel = require('../Core/Enums').UserLevel;

var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var TaskInput = require('../Models/TaskInput/TaskInput').TaskInput;

//TODO: MOve this in some util
function HandleResponseOnError(err, res, logMessage) {
    if (err) {
        HandleOnIssueFound(res, logMessage, MobileResponseStatusCode.ServerError);
        return true;
    }
    return false;
}

function HandleResponeOnDocNotFound(doc, res, logMessage) {
    if (!doc) {
        HandleOnIssueFound(res, logMessage, MobileResponseStatusCode.ResourceNotFound);
        return true;
    }
    return false;
}

function HandleOnIssueFound(res, logMessage, statusCode) {
    console.log(logMessage);
    response = MobileResponseWrapper.BuildResponse(statusCode, {});
    res.json(response || {});
}

function AttachBootToCompileContext(bootId, compileContext, callback) {
    var UserDAL = mongoose.model('User');
    UserDAL.findById(bootId).exec(function (err, bootUser) {
        compileContext.Boot = new UserCompileContext(bootUser.LastName, bootUser.ProfileImageUrl);
        callback(null);
    });
}

function AttachPlayerToCompileContext(playerId, compileContext, callback) {
    var UserDAL = mongoose.model('User');
    UserDAL.findById(playerId).exec(function (err, playerUser) {
        compileContext.Player = new UserCompileContext(playerUser.LastName, playerUser.ProfileImageUrl);
        callback(null, playerUser);
    });
}

function GetAnswerForPriorityQueue(priority, answers) {
    var answer = null;
    for (i = 0 ; i < priority.length; i++) {
        var answerStateType = priority[i];
        var answer = _.findWhere(answers, { State: answerStateType });
        if (answer) {
            return answer;
        };
    };
    return answer;
}

function GetAnswerForExpertUser(answers) {
    var priority = [
        AnswerStateType.WaitForTieBreaker,
        AnswerStateType.Rated,
        AnswerStateType.NotRated,
        AnswerStateType.Closed
    ];
    
    return GetAnswerForPriorityQueue(priority, answers);
}

function GetAnswerForRegularUser(answers) {
    var priority = [
        AnswerStateType.Rated,
        AnswerStateType.NotRated,
        AnswerStateType.Closed
    ];
    
    return GetAnswerForPriorityQueue(priority, answers);
}


function FindAnswerToRate(player, taskTemplateId, nodeId, compileContext, callback) {
        mongoose.model('Rating').find({ RaterId: player._id }).exec(function (err, submitedRatings) {
            var excludedAnswersList = _.map(submitedRatings, function (rating) {
                return rating.AnswerId;
            });

            mongoose.model('Answer').find({ TaskTemplateId: taskTemplateId , _id : {$nin: excludedAnswersList}}).
            where('NodeId').equals(nodeId).
            where('UserId').ne(player._id).
            exec(function (err, answers) {
                    var answer = null;
                    if (player.Level == UserLevel.Regular) {
                        answer = GetAnswerForRegularUser(answers);
                    }
                    else {
                        answer = GetAnswerForExpertUser(answers);
                    }
                
                    if (answer) {
                        var baseUrl = Config.Environment.BaseUrl;
                var recordingsUrls = _.map(answer.Recordings, function (record) {
                            //TODO: Uploads string move to a config file
                            return baseUrl + "Uploads/" + record;
                        });
                        compileContext.RecordingCollection = new RecordingCollectionCompileContext(recordingsUrls);
                        callback(null, answer);
                    }
                    else {
                        callback(null, null);
                    }
                });
        });
}

function AttachRateeToCompileContext(answer, compileContext, callback) {
    var UserDAL = mongoose.model('User');
    if (answer) {
        UserDAL.findById(answer.UserId).exec(function (err, rateeUser) {
            compileContext.Ratee = new UserCompileContext(rateeUser.LastName, rateeUser.ProfileImageUrl);
            callback(null, answer);
        });
    }
    else {
        callback(null);
    }
}

function BuildCompileContextForGetNodeStructure(bootId, playerId, taskTemplateId, nodeId, callback) {
    var compileContext = new CompileContext();
    Async.waterfall([
        function (callback) {
            AttachBootToCompileContext(bootId, compileContext, callback);
        },
        function (callback) {
            AttachPlayerToCompileContext(playerId, compileContext, callback);
        },
        function (player, callback) {
            FindAnswerToRate(player, taskTemplateId, nodeId, compileContext, callback);
        },
        function (answer, callback) {
            AttachRateeToCompileContext(answer, compileContext, callback);
        }
    ], function (err, answer) {
        if (err) {
            console.log(err.stack);
        }
        callback(err, compileContext, answer);
    });
}

exports.GetNodeStructure = function (req, res) {
    if (!req.session.UserId) {
        req.session.UserId = new ObjectID("55b800abf6493af8cbfb68c2"); // debug user
    }
    
    var taskId = req.params.taskId;
    var nodeId = parseInt(req.params.nodeId);
    
    Async.waterfall([
        function (callback) {
            mongoose.model('Task').findById(new ObjectID(taskId)).exec(function (err, task) {
                var node = task.FindNodeById(nodeId);
                var linkedNodeId = node.Properties.LinkedNodeId;
                callback(null, task.Template._id, linkedNodeId);
            });
        },

        function (taskTemplateId, linkedNodeId, callback) {
            // TODO: Get this from DB
            var danielleUserId = "55b84908f6493af8cbfb68c3";
            BuildCompileContextForGetNodeStructure(new ObjectID(danielleUserId), req.session.UserId , taskTemplateId, linkedNodeId, function (err, compileContext, answer) {
                
                var taskDAL = mongoose.model('Task');
                taskDAL.findById(new ObjectID(taskId)).exec(function (err, task) {
                    //TODO: Update this with the new wrappers
                    if (HandleResponseOnError(err, res, "Error finding task") ||
                        HandleResponeOnDocNotFound(task, res, "Task not found")) {
                        return;
                    }

                    task.UpdateRateeInfo(answer, function (err, task) { });
                    var node = task.FindNodeById(nodeId);
                    var builder = new ContextualOutputPropertiesJsonBuilderMobile();
                    var itemsJson = builder.BuildJson(node, compileContext);
                    
                    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, { Items: itemsJson });
                    
                    res.json(response || {});
                    callback(null);
                });
            });

        }
    ],
    function (err, results) {
        if (err) {
            console.log(err.stack);
        }
    });


}
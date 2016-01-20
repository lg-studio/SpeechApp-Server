var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');
var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;
var Config = require('../../Config/Config.global');
var Enums = require('../Core/Enums');

function UpdateBio(req, res) {
    var userId = req.session.UserId;
    var newProperties = JSON.parse(req.body.AccountData);
    
    if (req.files.length > 0) {
        filename = req.files[0].filename;
        //TODO: Put Resource in config file
        newProperties.ProfileImageUrl = Config.Environment.BaseUrl + 'Resource/' + filename;
    }
    
    mongoose.model("User").findOneAndUpdate({ _id: userId }, { $set : newProperties }).exec(function (err, user) {
        if (err) {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.ServerError, {});
            res.json(response);
            return;
        }
        if (user) {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, user.GetDetailsWithNoSensitiveData());
            res.json(response);
        }
        else {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.ResourceNotFound, {});
            res.json(response);
        }
    });
}

function GetProfileBio(req, res) {
    var mongoose = require('mongoose');
    mongoose.model("User").findById(req.session.UserId, function (err, user) {
        profileBioJson = {
            "ProfileBio" : user.GetDetailsWithNoSensitiveData()
        };
        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, profileBioJson);
        res.json(response);
    });
}

function GetProfileFeedbackStatistics(req, res) {
    var playerId = req.session.UserId;
    function computeGivenFeedbackStats(ratings, data){
        var tasSum = 0;
        ratings.forEach(function (r) {
            tasSum += r.TAS;
        });
        
        var averageTAS = null;
        if (ratings.length > 0) {
            averageTAS = tasSum / ratings.length;
        }
        var results = {
            FeedbacksCount : ratings.length,
            AverageFeedback : averageTAS
        }
        return results;
    }
    Async.parallel([
        function (callback) {
            mongoose.model('Rating').find({ RaterId : playerId }).exec(function (err, ratings) {
                var partialResults = computeGivenFeedbackStats(ratings);
                callback(null, partialResults);
            });
        },
        function (callback) {
            mongoose.model("Answer").find({
                UserId: playerId ,
                State : Enums.AnswerStateType.Closed
            }, function (err, answers) {
                var answersIdList = _.map(answers, function (a) {
                    return a._id;
                });
                mongoose.model('Rating').find({
                    AnswerId : { $in : answersIdList } ,
                    State : Enums.RatingStateType.Closed
                }).exec(function (err, ratings) {
                    var partialResults = computeGivenFeedbackStats(ratings);
                    callback(null, partialResults);
                });
            });
        },
        function (callback){
            mongoose.model('User').findById(playerId).exec(function (err, player) {
                var level = (player.Level == Enums.UserLevel.Expert)? "Expert" : "Regular";

                partialResults = {
                    FeedbackScore : player.RatingSkills,
                    FeedbackLevel: level
                }
                callback(null, partialResults);
            });
        }
    ], function (err, results) {
        var data = {
            FeedbacksGiven : results[0].FeedbacksCount,
            AvgFeedbackGiven : results[0].AverageFeedback,
            FeedbacksReceived : results[1].FeedbacksCount,
            AvgFeedbackReceived : results[1].AverageFeedback,
            FeedbackScore : results[2].FeedbackScore,
            FeedbackLevel : results[2].FeedbackLevel,
        }
        
        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
            Statistics : data
        });
        res.json(response);
    });

}

function GetProfileActivities(req, res){
    var userId = req.session.UserId;
    var offset = req.params.offset;
    var count = req.params.count;
    var activities = [];
    
    var states = [Enums.TaskStateType.New];

    mongoose.model('Task').find({ PlayerId : userId , State: { $nin : states } }).
    skip(offset).
    limit(count).
    sort({ TimeStamp: 'desc' }).
    exec(function (err, tasks) {
        tasks.forEach(function (task) {
            var activity = {
                "TaskId" : task._id.toString(),
                "TaskName" : task.Template.Caption,
                "Feedback" : task.TAS,
                "CreatedTimestamp" : task.TimeStamp
            };
            activities.push(activity);
        });
        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
            ProfileActivities : activities
        });
        res.json(response);
    });
}

function GetProfileCompetences(req, res){
    var CompetenceNodeHandlingStrategies = require('../Tree/NodeHandlingStategies/CompetenceNodeHandlingStrategies');
    var treeStructureId = "55daf024491e454550dc2b4b";
    var context = {
        PlayerId: req.session.UserId
    }
    //TODO: treeStructureId
    mongoose.model('TreeStructure').findById(treeStructureId).exec(function (err, tree) {
        tree.FetchTree(function (err, tree) {
            tree.WalkTree(CompetenceNodeHandlingStrategies.FetchProperties, null, function (err, tree) {
                tree.WalkTree(CompetenceNodeHandlingStrategies.ComputeRating, context, function (err, tree) {
                    tree.WalkTree(CompetenceNodeHandlingStrategies.BuildJsonForMobile, context, function (err, tree) {
                        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
                            Competences : [tree.RootNode.Properties.MobileJsonRepresentation]
                        });
                        res.json(response);
                    });
                });
            });
        });
    });
}


exports.UpdateBio = UpdateBio;
exports.GetProfileBio = GetProfileBio;
exports.GetProfileFeedbackStatistics = GetProfileFeedbackStatistics;
exports.GetProfileActivities = GetProfileActivities;
exports.GetProfileCompetences = GetProfileCompetences;
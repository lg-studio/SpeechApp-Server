var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var Async = require('async');

var CompileContext = require('../Compiler/Models/CompileContext').CompileContext;
var UserCompileContext = require('../Compiler/Models/UserCompileContext').UserCompileContext;
var RecordingCompileContext = require('../Compiler/Models/RecordingCompileContext').RecordingCompileContext;

var TaskJsonBuilderMobile = require('../Builders/Mobile/TaskJsonBuilderMobile').TaskJsonBuilderMobile;
var ContextualOutputPropertiesJsonBuilderMobile = require('../Builders/Mobile/ContextualOutputPropertiesJsonBuilderMobile').ContextualOutputPropertiesJsonBuilderMobile;

var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var TaskStateType = require('../Core/Enums').TaskStateType;

function HandleResponseOnError(err, res, logMessage){
    if (err) {
        HandleOnIssueFound(res, logMessage, MobileResponseStatusCode.ServerError);
        return true;
    }
    return false;
}

function HandleResponeOnDocNotFound(doc, res, logMessage){
    if (!doc) {
        HandleOnIssueFound(res, logMessage, MobileResponseStatusCode.ResourceNotFound);
        return true;
    }
    return false;
}

function HandleOnIssueFound(res, logMessage, statusCode){
    console.log(logMessage);
    response = MobileResponseWrapper.BuildResponse(statusCode, {});
    res.json(response || {});
}

function BuildCompileContextForCreateNewTaskInstance(bootId, playerId, callback){
    var compileContext = new CompileContext();
    var UserDAL = mongoose.model('User');
    Async.parallel([
        function (callback){
            UserDAL.findById(bootId).exec(function (err, bootUser) {
                compileContext.Boot = new UserCompileContext(bootUser.LastName, bootUser.ProfileImageUrl);
                callback(null);
            });
        },

        function (callback){
            UserDAL.findById(playerId).exec(function (err, playerUser) {
                compileContext.Player = new UserCompileContext(playerUser.LastName, playerUser.ProfileImageUrl);
                callback(null);
            });
        }
    ], function (err) {
        if (err) {
            console.log(err.stack);
        }
        callback(err, compileContext);
    });
}

exports.CreateNewTaskInstance = function (req, res){
    //TODO: Remove when done
    if (!req.session.UserId) {
        req.session.UserId = new ObjectID("55b800abf6493af8cbfb68c2"); // debug user
    }

    var danielleUserId = "55b84908f6493af8cbfb68c3";
    BuildCompileContextForCreateNewTaskInstance(new ObjectID(danielleUserId), req.session.UserId , function (err, compileContext) {
        var id = req.params.taskTemplateId;
        var taskTemplateDAL = mongoose.model('TaskTemplate');
        taskTemplateDAL.findById(new ObjectID(id)).exec(function (err, taskTemplate) {
            if (HandleResponseOnError(err, res, "Error finding taskTemplate") ||
            HandleResponeOnDocNotFound(taskTemplate, res, "Template not found")) {
                return;
            }
            
            var taskDAL = mongoose.model('Task');
            var taskInstance = new taskDAL({
                PlayerId: new ObjectID(req.session.UserId),
                Template: taskTemplate._doc,
                State: TaskStateType.New,
                TAS: null,
                TimeStamp: Date.now(),
                Answers: [],
                Ratings: [],
                RateesInfo: []
            });
            
            taskInstance.save(function (err, task) {
                var response = {};
                if (HandleResponseOnError(err, res, "Error finding taskTemplate")) {
                    return;
                }
                else {
                    var builder = new TaskJsonBuilderMobile();
                    var itemsJson = builder.BuildJson(task._doc.Template, compileContext);
                    
                    response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
                        TaskId: task._id,
                        Items: itemsJson
                    });
                    res.json(response || {});
                }
            });
        });
    });
}
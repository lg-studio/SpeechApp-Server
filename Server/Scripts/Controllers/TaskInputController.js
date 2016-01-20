var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');

var ObjectID = require('mongodb').ObjectID;
var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var AnswerStateType = require('../Core/Enums').AnswerStateType;
var RatingStateType = require('../Core/Enums').RatingStateType;

function RemapAnswersRecordingsPath(taskInput, files) {
    var answers = taskInput.Answers;
    var remappedAnswers = [];
    var orginalNameToFileNameMapping = {};
    _.forEach(files, function (f) {
        orginalNameToFileNameMapping[f.originalname] = f.filename;
    });
    
    _.forEach(answers, function (answerInput) {
        var remappedFileNames = _.map(answerInput.FileNames, function (originalName) {
            return orginalNameToFileNameMapping[originalName];
        });
        answerInput.FileNames = remappedFileNames;
    });
}

exports.PostTaskInput = function (req, res) {
    //TODO: Remove when done
    if (!req.session.UserId) {
        req.session.UserId = new ObjectID("55b800abf6493af8cbfb68c2"); // debug user
    }
    var taskInput = JSON.parse(req.body.Inputs);
    RemapAnswersRecordingsPath(taskInput, req.files);
    mongoose.model('Task').findById(taskInput.TaskId).exec(function (err, task) {
        task.HandleInput(taskInput, new ObjectID(req.session.UserId), function () {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {});
            res.json(response);
        })
    });
}
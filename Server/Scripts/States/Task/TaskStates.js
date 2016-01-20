var assert = require("assert");
var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');
var fs = require('fs');

var TaskStateType = require('../../Core/Enums').TaskStateType;
var AnswerStateType = require('../../Core/Enums').AnswerStateType;

var NewTaskState = (function () {
    var NewTaskState = function (task) {
        this.task = task;
    }
    NewTaskState.prototype.UpdateState = function (callback) {
        var questionsCount = this.task.GetQuestions().length;
        var answersCount = this.task.Answers.length;
        if (questionsCount == answersCount) {
            this.task.State = TaskStateType.WaitForFeedback;
            this.task.save(callback)
        }
    }
    return NewTaskState;
})();

var WaitForFeedbackTaskState = (function () {
    var WaitForFeedbackTaskState = function (task) {
        this.task = task;
    }

    WaitForFeedbackTaskState.prototype.UpdateState = function (callback) {
        var task = this.task;
        var questionsCount = task.GetQuestions().length;
        task.GetAnswers(function (err, answers) {
            if (err) {
                callback(err,task);
                return;
            }
            if (questionsCount == answers.length) {
                var allAnswersClosed = true;
                answers.forEach(function (answer) {
                    if (answer.State != AnswerStateType.Closed) {
                        allAnswersClosed = false;
                    }
                });
                
                if (allAnswersClosed) {
                    task.State = TaskStateType.Closed;
                    task.TAS = task.ComputeAverageTas(answers);
                    task.save(callback);
                }
                else {
                    callback(null, task);
                }
            }

        });
    }
    return WaitForFeedbackTaskState;
})();

var ClosedTaskState = (function () {
    var ClosedTaskState = function (task) {
        this.task = task;
    }
    ClosedTaskState.prototype.UpdateState = function (callback) {
        callback(null, this.task);
    }
    return ClosedTaskState;
})();

var TaskStateFactory = (function () {
    var TaskStateFactory = function () {

    }
    TaskStateFactory.Create = function (task) {
        switch (task.State) {
            case TaskStateType.New:
                return new NewTaskState(task);
            case TaskStateType.WaitForFeedback:
                return new WaitForFeedbackTaskState(task);
            case TaskStateType.Closed:
                return new ClosedTaskState(task);
        }
    }
    
    return TaskStateFactory;
})();


exports.NewTaskState = NewTaskState;
exports.WaitForFeedbackTaskState = WaitForFeedbackTaskState;
exports.ClosedTaskState = ClosedTaskState;
exports.TaskStateFactory = TaskStateFactory;
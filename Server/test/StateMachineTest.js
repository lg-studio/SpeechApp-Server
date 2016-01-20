var assert = require("assert");
var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');
var fs = require('fs');
var log4js = require('log4js');

var Config = require('../Config/Config.global');

var AnswerStateType = require('../Scripts/Core/Enums').AnswerStateType;
var RatingStateType = require('../Scripts/Core/Enums').RatingStateType;
var TaskStateType = require('../Scripts/Core/Enums').TaskStateType;

var NewTaskState = require('../Scripts/States/Task/TaskStates').NewTaskState;
var WaitForFeedbackTaskState = require('../Scripts/States/Task/TaskStates').WaitForFeedbackTaskState;
var ClosedTaskState = require('../Scripts/States/Task/TaskStates').ClosedTaskState;
var TaskStateFactory = require('../Scripts/States/Task/TaskStates').TaskStateFactory;

var NotRatedAnswerState = require('../Scripts/States/Answer/AnswerStates').NotRatedAnswerState;
var RatedAnswerState = require('../Scripts/States/Answer/AnswerStates').RatedAnswerState;
var WaitForTieBreakerAnswerState = require('../Scripts/States/Answer/AnswerStates').WaitForTieBreakerAnswerState;
var ClosedAnswerState = require('../Scripts/States/Answer/AnswerStates').ClosedAnswerState;
var AnswerStateFactory = require('../Scripts/States/Answer/AnswerStates').AnswerStateFactory;

var NewRatingState = require('../Scripts/States/Rating/RatingStates').NewRatingState;
var WaitForAcceptanceRatingState = require('../Scripts/States/Rating/RatingStates').WaitForAcceptanceRatingState;
var WaitForTieBreakerRatingState = require('../Scripts/States/Rating/RatingStates').WaitForTieBreakerRatingState;
var IgnoreRatingState= require('../Scripts/States/Rating/RatingStates').IgnoreRatingState;
var ClosedRatingState = require('../Scripts/States/Rating/RatingStates').ClosedRatingState;
var RatingStateFactory = require('../Scripts/States/Rating/RatingStates').RatingStateFactory;


log4js.configure(Config.LogConfig);

var logger = log4js.getLogger('States');
logger.debug('>>> Test Run <<<<');

var aRatingId = "55bbce5ff01ddf2c25c6427b";
var bRatingId = "55bbce7ff01ddf2c25c64282";
var cRatingId = "55bbced6f01ddf2c25c64289";

var tieBreakerId = "55bbced6f01ddf2c25c64289";
var anAnswerId = "55bbce33f01ddf2c25c64277";
var aTaskId = "55bbce43f01ddf2c25c64278";

function testNewRatingState(done){
    mongoose.model("Rating").findById(aRatingId).exec(function (err, rating) {
        var state = new NewRatingState(rating);
        state.UpdateState(function (err, rating) {
            done();
        });
    });
}

function testWaitForAcceptanceRatingState(done) {
    mongoose.model("Rating").findById(aRatingId).exec(function (err, rating) {
        var state = new WaitForAcceptanceRatingState(rating);
        state.UpdateState(function (err, rating) {
            done();
        });
    });
}

function testWaitForTieBreakerRatingState(done) {
    mongoose.model("Rating").findById(aRatingId).exec(function (err, rating) {
        var state = new WaitForTieBreakerRatingState(rating);
        state.UpdateState(function (err, rating) {
            done();
        });
    });
}

function testIgnoreRatingState(done){
    mongoose.model("Rating").findById(aRatingId).exec(function (err, rating) {
        var state = new IgnoreRatingState(rating);
        state.UpdateState(function (err, rating) {
            done();
        });
    });
}

function testClosedRatingState(done) {
    mongoose.model("Rating").findById(tieBreakerId).exec(function (err, rating) {
        var state = new ClosedRatingState(rating);
        state.UpdateState(function (err, rating) {
            done();
        });
    });
}

function testNotRatedAnswerState(done) {
    mongoose.model("Answer").findById(anAnswerId).exec(function (err, answer) {
        var state = new NotRatedAnswerState(answer);
        state.UpdateState(function (err) {
            done();
        });
    });
}

function testRatedAnswerState(done) {
    mongoose.model("Answer").findById(anAnswerId).exec(function (err, answer) {
        var state = new RatedAnswerState(answer);
        state.UpdateState(function (err) {
            done();
        });
    });
}

function testWaitForTieBreakerAnswerState(done) {
    mongoose.model("Answer").findById(anAnswerId).exec(function (err, answer) {
        var state = new WaitForTieBreakerAnswerState(answer);
        state.UpdateState(function (err) {
            done();
        });
    });
}

function testClosedAnswerState(done) {
    mongoose.model("Answer").findById(anAnswerId).exec(function (err, answer) {
        var state = new ClosedAnswerState(answer);
        state.UpdateState(function (err) {
            done();
        });
    });
}

function testNewTaskState(done) {
    mongoose.model("Task").findById(aTaskId).exec(function (err, task) {
        var state = new NewTaskState(task);
        state.UpdateState(function (err) {
            done();
        });
    });
}
function testWaitForFeedbackTaskState(done) {
    mongoose.model("Task").findById(aTaskId).exec(function (err, task) {
        var state = new WaitForFeedbackTaskState(task);
        state.UpdateState(function (err) {
            done();
        });
    });
}
function testClosedTaskState(done) {
    mongoose.model("Task").findById(aTaskId).exec(function (err, task) {
        var state = new ClosedTaskState(task);
        state.UpdateState(function (err) {
            done();
        });
    });
}

var BootStrap = {
    aRating: {
        Id : "55bbce5ff01ddf2c25c6427b",
        State: RatingStateType.New
    },
    bRating: {
        Id : "55bbce7ff01ddf2c25c64282",
        State: RatingStateType.New
    },
    cRating: {
        Id : "55bbced6f01ddf2c25c64289",
        State: RatingStateType.New
    },
    answer: {
        Id : "55bbce57f01ddf2c25c6427a",
        State: AnswerStateType.NotRated
    },
    task: {
        Id : "55bbce43f01ddf2c25c64278",
        State: TaskStateType.New
    }
}

var aRatingId = "55bbce5ff01ddf2c25c6427b";
var bRatingId = "55bbce7ff01ddf2c25c64282";
var cRatingId = "55bbced6f01ddf2c25c64289";

function testChaineOfUpdates(done){
    mongoose.model("Rating").findById(aRatingId).exec(function (err, rating) {
        debugger;
        rating.UpdateState(function (err) {
            debugger;
            done();
        });
    });
}

function testSetup(doneCallback) {
    var answerId = "55bbce33f01ddf2c25c64277";
    var taskId = "55bbce43f01ddf2c25c64278";

    Async.series([
        function (callback){
            mongoose.model("Rating").findById(BootStrap.aRating.Id).exec(function (err, rating) {
                rating.State = BootStrap.aRating.State;
                rating.save(callback);
            });
        },
        function (callback) {
            mongoose.model("Rating").findById(BootStrap.bRating.Id).exec(function (err, rating) {
                rating.State = BootStrap.bRating.State;
                rating.save(callback);
            });
        },
        function (callback) {
            mongoose.model("Rating").findById(BootStrap.cRating.Id).exec(function (err, rating) {
                rating.State = BootStrap.cRating.State;
                rating.save(callback);
            });
        },
        function (callback) {
            mongoose.model("Answer").findById(BootStrap.answer.Id).exec(function (err, answer) {
                answer.State = BootStrap.answer.State;
                answer.save(callback);
            });
        },
        function (callback) {
            mongoose.model("Task").findById(BootStrap.task.Id).exec(function (err, task) {
                task.State = BootStrap.task.State;
                task.save(callback);
            });
        }
    ], function (err, results) {
            doneCallback();
    });
}
function testMethods(done){
    testSetup(function () {
        debugger;
        //testNewRatingState(done);
        //testWaitForAcceptanceRatingState(done);
        //testWaitForTieBreakerRatingState(done);
        //testIgnoreRatingState(done);
        //testClosedRatingState(done);
        
        //testNotRatedAnswerState(done);
        //testRatedAnswerState(done);
        //testWaitForTieBreakerAnswerState(done);
        //testClosedAnswerState(done);
        
        //testNewTaskState(done);
        //testWaitForFeedbackTaskState(done);
        //testClosedTaskState(done);
        //testChaineOfUpdates(done);
        ratedAnswersIds = ['55bbce33f01ddf2c25c64277'];
        Async.eachSeries(ratedAnswersIds, function (ratedAnswerId, cb) {
            debugger;
            mongoose.model('Answer').findById(ratedAnswerId).exec(function (err, answer) {
                debugger;
                answer.GetTaskInstance(function (err, task) {
                    debugger;
                    task.UpdateStateOfAllAssociatedEntities(cb);
                });
            });
        }, function (err, callback) {
            debugger;
            done();
            //debugger;
            //task.UpdateStateOfAllAssociatedEntities(function () {
            //    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {});
            //    res.json(response);
            });

        //mongoose.model('Task').findById(BootStrap.task.Id).exec(function (err, task) {
        //    task.UpdateStateOfAllAssociatedEntities(done);
        //});
    });

}

describe('State Machine', function () {
    it('should fetch all the entities properly', function (done) {
        // Bootstrap models
        var modelsPath = "D:/coding/SpeechApp/Server/Server/Scripts/DAL/";
        fs.readdirSync(modelsPath).forEach(function (file) {
            if (~file.indexOf('.js')) {
                var fullPath = modelsPath + file;
                require(fullPath);
            }
        });

        mongoose.connect("mongodb://localhost:27017/SpeechApp-Test", function () {
            testMethods(done);
        });
        

    });
});

var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');
var fs = require('fs');

var AnswerStateType = require('../../Core/Enums').AnswerStateType;
var RatingStateType = require('../../Core/Enums').RatingStateType;

var NotRatedAnswerState = (function () {
    var NotRatedAnswerState = function (answer) {
        this.answer = answer;
    }
    NotRatedAnswerState.prototype.UpdateState = function (callback) {
        var answer = this.answer;
        answer.GetRatings(function (err, ratings) {
            if (ratings.length > 0) {
                answer.State = AnswerStateType.Rated;
                answer.save(callback);
            }
            else {
                callback(null, answer);
            }
        });
    }
    return NotRatedAnswerState;
})();

var RatedAnswerState = (function () {
    var RatedAnswerState = function (answer) {
        this.answer = answer;
    }
    RatedAnswerState.prototype.UpdateState = function (callback) {
        //TODO: Move this to config file
        var minRatings = 2;
        var answer = this.answer;
        answer.GetRatings(function (err, ratings) {
            var closedRatings = _.filter(ratings, function (rating) {
                return (rating.State == RatingStateType.Closed);
            });
            
            if (closedRatings.length >= minRatings) {
                answer.State = AnswerStateType.Closed;
                answer.TAS = answer.ComputeWeightedTas(closedRatings);
            }
            else if (ratings.length >= minRatings) {
                answer.State = AnswerStateType.WaitForTieBreaker;
            }
            answer.save(callback);
        });
    }
    return RatedAnswerState;
})();

var WaitForTieBreakerAnswerState = (function () {
    var WaitForTieBreakerAnswerState = function (answer) {
        this.answer = answer;
    }
    WaitForTieBreakerAnswerState.prototype.UpdateState = function (callback) {
        var minRatings = 2;
        var answer = this.answer;
        answer.GetRatings(function (err, ratings) {
            var closedRatings = _.filter(ratings, function (rating) {
                return (rating.State == RatingStateType.Closed);
            });
            
            if (closedRatings.length >= minRatings) {
                answer.State = AnswerStateType.Closed;
                answer.TAS = answer.ComputeWeightedTas(closedRatings);
                answer.save(callback);
            }
            else {
                callback(null, answer);
            }
        });
    }
    return WaitForTieBreakerAnswerState;
})();

var ClosedAnswerState = (function () {
    var ClosedAnswerState = function (answer) {
        this.answer = answer;
    }
    ClosedAnswerState.prototype.UpdateState = function (callback) {
        callback(null, this.answer);
    }
    return ClosedAnswerState;
})();

var AnswerStateFactory = (function () {
    var AnswerStateFactory = function () {

    }
    
    AnswerStateFactory.Create = function (answer) {
        switch (answer.State) {
            case AnswerStateType.NotRated:
                return new NotRatedAnswerState(answer);
            case AnswerStateType.Rated:
                return new RatedAnswerState(answer);
            case AnswerStateType.WaitForTieBreaker:
                return new WaitForTieBreakerAnswerState(answer);
            case AnswerStateType.Closed:
                return new ClosedAnswerState(answer);
        }
    }
    return AnswerStateFactory;
})();

exports.NotRatedAnswerState = NotRatedAnswerState;
exports.RatedAnswerState = RatedAnswerState;
exports.WaitForTieBreakerAnswerState = WaitForTieBreakerAnswerState;
exports.ClosedAnswerState = ClosedAnswerState;
exports.AnswerStateFactory = AnswerStateFactory;
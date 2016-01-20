var _ = require('underscore');
var mongoose = require('mongoose');
var Async = require('async');
var fs = require('fs');

var Enums = require('../../Core/Enums');
var RatingStateType = Enums.RatingStateType;
var AnswerStateType = Enums.AnswerStateType;
var RatingType = Enums.RatingType;

var NewRatingState = (function () {
    var NewRatingState = function (rating) {
        this.rating = rating;
    }
    
    NewRatingState.prototype.UpdateState = function (callback) {
        var rating = this.rating;
        //TODO: Use enums
        if (rating.Type == RatingType.Regular) {
            rating.GetAnswerInstance(function (err, answer) {
                if (answer.State != AnswerStateType.Closed &&
                    answer.State != AnswerStateType.WaitForTieBreaker) {
                    rating.State = RatingStateType.WaitForAcceptance;
                    rating.save(function (err, rating) {
                        if (err) {
                            console.log("Error updating state of rating");
                            callback(err, rating);
                        }
                        callback(err, rating);
                    })
                }
                else {
                    rating.State = RatingStateType.Ignore;
                    rating.save(callback);
                }
            });
        }
        else if (rating.Type == RatingType.TieBreaker) {
            rating.State = RatingStateType.Closed;
            rating.save(callback);
        }
    }
    return NewRatingState;
})();

var WaitForAcceptanceRatingState = (function () {
    var WaitForAcceptanceRatingState = function (rating) {
        this.rating = rating;
    }
    WaitForAcceptanceRatingState.prototype.UpdateState = function (callback) {
        var rating = this.rating;
        rating.GetRatingsGroupedForTieBreak(function (err, groupedRatings) {
            if (!groupedRatings.Second) {
                callback(err, rating);
            }
            else {
                if (Math.abs(rating.TAS - groupedRatings.Second.TAS) > 0.35) {
                    rating.State = RatingStateType.WaitForTieBreaker;
                    rating.save(callback);
                }
                else {
                    rating.State = RatingStateType.Closed;
                    rating.save(function (err, rating) {
                        rating.GetRaterInstance(function (err, rater) {
                            rater.UpdateRatingSkills(rating, function (err, rater) {
                                callback(err, rating);
                            });
                        });
                    });
                }
            }
        });
    };
    return WaitForAcceptanceRatingState;
})();

var WaitForTieBreakerRatingState = (function () {
    var WaitForTieBreakerRatingState = function (rating) {
        this.rating = rating;
    }
    WaitForTieBreakerRatingState.prototype.UpdateState = function (callback) {
        var rating = this.rating;
        rating.GetRatingsGroupedForTieBreak(function (err, groupedRatings) {
            if (groupedRatings.TieBreaker) {
                var delta0 = Math.abs(rating.TAS - groupedRatings.TieBreaker.TAS);
                var delta1 = Math.abs(groupedRatings.Second.TAS - groupedRatings.TieBreaker.TAS);
                
                if (delta0 > delta1) {
                    rating.State = RatingStateType.Ignore;
                }
                else {
                    rating.State = RatingStateType.Closed;
                }

                rating.save(function (err, rating) {
                    rating.GetRaterInstance(function (err, rater) {
                        rater.UpdateRatingSkills(rating, function (err, rater) {
                            callback(err, rating);
                        });
                    });
                });
            }
            else {
                callback(null, rating);
            };
        });
    }
    
    return WaitForTieBreakerRatingState;
})();

var IgnoreRatingState = (function () {
    var IgnoreRatingState = function (rating) {
        this.rating = rating;
    }
    
    IgnoreRatingState.prototype.UpdateState = function (callback) {
        callback(null, this.rating);
    }
    
    return IgnoreRatingState;
})();

var ClosedRatingState = (function () {
    var ClosedRatingState = function (rating) {
        this.rating = rating;
    }
    
    ClosedRatingState.prototype.UpdateState = function (callback) {
        callback(null, this.rating);
    }
    
    return ClosedRatingState;
})();

var RatingStateFactory = (function () {
    var RatingStateFactory = function () {

    }
    
    RatingStateFactory.Create = function (rating) {
        switch (rating.State) {
            case RatingStateType.New:
                return new NewRatingState(rating);
            case RatingStateType.WaitForAcceptance:
                return new WaitForAcceptanceRatingState(rating);
            case RatingStateType.WaitForTieBreaker:
                return new WaitForTieBreakerRatingState(rating);
            case RatingStateType.Ignore:
                return new IgnoreRatingState(rating);
            case RatingStateType.Closed:
                return new ClosedRatingState(rating);
        }
    }
    
    return RatingStateFactory;
})();


exports.NewRatingState = NewRatingState;
exports.WaitForAcceptanceRatingState = WaitForAcceptanceRatingState;
exports.WaitForTieBreakerRatingState = WaitForTieBreakerRatingState;
exports.IgnoreRatingState = IgnoreRatingState;
exports.ClosedRatingState = ClosedRatingState;
exports.RatingStateFactory = RatingStateFactory;
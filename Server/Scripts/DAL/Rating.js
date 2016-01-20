var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Async = require('async');

var RatingStateFactory = require('../States/Rating/RatingStates').RatingStateFactory;
var RatingType = require('../Core/Enums').RatingType;

var logger = require('log4js').getLogger('States');

var RatingSchema = new Schema({
    RaterId: { type: Schema.Types.ObjectId },
    Type: { type: Schema.Types.String },
    AnswerId: { type: Schema.Types.ObjectId },
    State: { type: Schema.Types.Number },
    TaskId: { type: Schema.Types.ObjectId },
    NodeId: { type: Schema.Types.Number },
    RaterRatingSkillsSnapshot: { type: Schema.Types.Mixed },
    Metrics: [
        {
            Id: { type: Schema.Types.Number },
            Rating: { type : Schema.Types.Mixed },
            Type: { type: String },
        }],
    TAS: { type: Schema.Types.Mixed }
});

RatingSchema.methods = {
    GetRaterInstance : function (callback) {
        mongoose.model("User").findById(this.RaterId).exec(callback);
    },
    
    GetAnswerInstance : function (callback) {
        mongoose.model("Answer").findById(this.AnswerId).exec(callback);
    },

    GetTaskInstance : function (callback) {
        mongoose.model("Task").findById(this.TaskId).exec(callback);
    },
    
    GetRatingsGroupedForTieBreak : function (callback) {
        var groupedRatings = {
            Current: this,
            Second: {},
            TieBreaker: {}
        }
        
        mongoose.model("Rating").
    find({ AnswerId : this.AnswerId }).
    where('_id').ne(this._id).
    exec(function (err, ratings) {
            //TODO: This is just for safety, we should not get Ignore,Closed ratings... we should log if this happens
            var filteredRatings = _.filter(ratings, function (r) {
                if (r.State != RatingType.Ignore &&
                    r.State != RatingType.Closed) {
                    return true;
                }
                return false;
            });

            groupedRatings.Second = _.findWhere(filteredRatings, { Type : RatingType.Regular });
            groupedRatings.TieBreaker = _.findWhere(filteredRatings, { Type: RatingType.TieBreaker });
            callback(err, groupedRatings);
        });

    },

    UpdateState : function (callback) {
        var currentState = RatingStateFactory.Create(this);
        var previousStateType = this.State;
        currentState.UpdateState(function (err, rating) {
            var newStateType = rating.State;
            logger.debug('\nrating.id: ' + rating._id.toString() + '\n State :' + previousStateType + ' -> ' + newStateType);
            if (previousStateType == newStateType) {
                callback(err);
            }
            else {
                rating.UpdateState(callback);
            }
        });
    }
}

mongoose.model("Rating", RatingSchema, "Ratings");
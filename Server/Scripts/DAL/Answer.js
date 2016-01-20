var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerStateFactory = require('../States/Answer/AnswerStates').AnswerStateFactory;
var logger = require('log4js').getLogger('States');

var AnswerSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId },
    TaskId: { type: Schema.Types.ObjectId },
    TaskTemplateId: { type: Schema.Types.ObjectId },
    NodeId: { type: Schema.Types.Number },
    Recordings: { type: [Schema.Types.String] },
    TAS: { type: Schema.Types.Mixed },
    State: { type: Schema.Types.Number },
});

AnswerSchema.methods = {
    GetUserInstance : function (callback) {
        mongoose.model("User").findById(this.UserId).exec(callback);
    },
    GetTaskInstance : function (callback) {
        mongoose.model("Task").findById(this.TaskId).exec(callback);
    },
    
    GetRatings : function (callback) {
        mongoose.model("Rating").find({ AnswerId: this._id }).exec(callback);
    },
    ComputeWeightedTas : function (ratings) {
        numerator = 0;
        denominator = 0;
        
        ratings.forEach(function (r) {
            ratingWeigth = r.RaterRatingSkillsSnapshot;
            numerator += ratingWeigth * r.TAS;
            denominator += ratingWeigth;
        });
        //TODO: log if division by 0
        if (denominator == 0) throw Error("ComputeWeightedTas Division by 0");
        return numerator / denominator;
    },
    UpdateState : function (callback) {
        var currentState = AnswerStateFactory.Create(this);
        var previousStateType = this.State;
        currentState.UpdateState(function (err, answer) {
            var newStateType = answer.State;
            logger.debug('\nanswer.id: ' + answer._id.toString() + '\n State :' + previousStateType + ' -> ' + newStateType);
            if (previousStateType == newStateType) {
                callback(err);
            }
            else {
                answer.UpdateState(callback);
            }
        });
    }
}


mongoose.model("Answer", AnswerSchema, "Answers");

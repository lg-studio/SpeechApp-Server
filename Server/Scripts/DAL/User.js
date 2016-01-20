var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserLevel = require('../Core/Enums').UserLevel;
var UserType = require('../Core/Enums').UserType;
var RatingStateType = require('../Core/Enums').RatingStateType;

var UserSchema = new Schema({
    Email: { type: Schema.Types.String },
    ProviderId: { type: Schema.Types.Mixed },
    LoginType: { type: Schema.Types.String },
    Type: { type: Schema.Types.String },
    RatingSkills: {type: Schema.Types.Mixed},
    ProfileImageUrl: { type: Schema.Types.String },
    FirstName: { type: Schema.Types.String },
    LastName: { type: Schema.Types.String },
    NativeLanguage : { type: Schema.Types.String },
    Gender: { type: Schema.Types.String },
    HomeCountry: { type: Schema.Types.String },
    BornYear: { type: Schema.Types.Number },
    Password: { type: Schema.Types.String },
    AccountState: { type: Schema.Types.Number }
});

UserSchema.methods = {
    GetDetailsWithNoSensitiveData : function (){
        var json = _.clone(this._doc);
        delete json.Password;
        delete json.ProviderId;
        return json;
    },

    UpdateRatingSkills: function (rating, callback){
        var minRatingSkill = 1;
        var maxRatingSkill = 4;
        var deltaRatingSkills = 0.05;
        deltaRatingSkills *= (rating.State == RatingStateType.Closed)? 1 : -1;
        newRatingSkills = this.RatingSkills + deltaRatingSkills;
        newRatingSkills = Math.max(minRatingSkill, newRatingSkills);
        newRatingSkills = Math.min(maxRatingSkill, newRatingSkills);
        this.RatingSkills = newRatingSkills;
        this.save(callback);
    }
}

UserSchema.virtual('Level').get(function () {
    var minPromoteScore = 3;
    if (this.RatingSkills >= minPromoteScore || this.Type != UserType.Regular) {
        return UserLevel.Expert;
    }
    return UserLevel.Regular;
});

mongoose.model("User", UserSchema, "Users");
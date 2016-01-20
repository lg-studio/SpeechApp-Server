var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ActivationToken = new Schema({
    TokenKey: { type: Schema.Types.String },
    UserId: { type: Schema.Types.ObjectId },
    Timestamp: { type: Schema.Types.Number },
    State: {type:Schema.Types.Number}
});

mongoose.model("ActivationToken", ActivationToken, "ActivationTokens");
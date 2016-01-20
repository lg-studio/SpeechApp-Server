var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordingSchema = new Schema({
    Data: { type: Schema.Types.Mixed }
});

mongoose.model("Recording", RecordingSchema, "Recordings");
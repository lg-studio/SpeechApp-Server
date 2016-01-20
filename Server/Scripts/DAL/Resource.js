var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
    MimeType: { type: Schema.Types.String },
    Data: { type: Schema.Types.Mixed }
});

mongoose.model("Resource", ResourceSchema, "Resources");
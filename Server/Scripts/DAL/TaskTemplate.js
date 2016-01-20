var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskTemplateSchema = new Schema({
    Caption: { type: String, defaults: '', trim: true },
    Type: { type: String },
    CompetenceId: {type : Schema.Types.ObjectId},
    IconUrl: {type: String},
    Nodes: {
        type: [
            {
                Id: { type : Number },
                Type: { type: String },
                Properties: { type: Schema.Types.Mixed }
            }
        ]
    }
});

mongoose.model("TaskTemplate", TaskTemplateSchema, "TaskTemplates");
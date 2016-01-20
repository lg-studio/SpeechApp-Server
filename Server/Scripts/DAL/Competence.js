var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Competence = new Schema({
    Name: { type: Schema.Types.String },
    Description: { type: Schema.Types.String }
});

mongoose.model("Competence", Competence, "Competences");
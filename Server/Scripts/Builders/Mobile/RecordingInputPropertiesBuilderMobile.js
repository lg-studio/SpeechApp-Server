var _ = require('underscore');

var RecordingInputPropertiesBuilderMobile = (function () {
    var RecordingInputPropertiesBuilderMobile = function () {
    }
    RecordingInputPropertiesBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        json = {};
        json['MinLength'] = document.MinLength;
        json['MaxLength'] = document.MaxLength;
        json['MaxRecordings'] = document.MaxRecordings;
        json['MaxRetriesPerRecording'] = document.MaxRetriesPerRecording;
        return json;
    }
    return RecordingInputPropertiesBuilderMobile;
})();

exports.RecordingInputPropertiesBuilderMobile = RecordingInputPropertiesBuilderMobile;
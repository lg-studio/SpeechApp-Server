var DynamicContentRecordingFieldType = require('../Core/Enums').DynamicContentRecordingFieldType;

var RecordingEntryDynamicContentResolver = (function () {
    var RecordingEntryDynamicContentResolver = function (recording) {
        this.recording = recording;
    }
    RecordingEntryDynamicContentResolver.prototype.Resolve = function (field) {
        var value = null;
        switch (field) {
            case DynamicContentRecordingFieldType.AudioUrl:
                value = this.recording.AudioUrl;
                break;
            default:
                value = null;
        }
        return value;
    }
    return RecordingEntryDynamicContentResolver;
})();

exports.RecordingEntryDynamicContentResolver = RecordingEntryDynamicContentResolver;

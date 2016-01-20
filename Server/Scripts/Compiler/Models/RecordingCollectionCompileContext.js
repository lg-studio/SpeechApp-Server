var RecordingCompileContext = require('./RecordingCompileContext').RecordingCompileContext;

var RecordingCollectionCompileContext = (function () {
    function RecordingCollectionCompileContext(recordingUrlList) {
        this.cursorIndex = 0;
        this.recordingList = [];
        var this_ = this;
        recordingUrlList.forEach(function (url, index) {
            this_.recordingList.push(new RecordingCompileContext(url));
        });
    }

    Object.defineProperty(RecordingCollectionCompileContext.prototype, "Count", {
        get: function () {
            return this.recordingList.length;
        },
        enumerable: true,
        configurable: true
    });

    RecordingCollectionCompileContext.prototype.GetNextRecording = function () {
        var rec = null;
        if (this.cursorIndex < this.Count) {
            rec = this.recordingList[this.cursorIndex];
            this.cursorIndex++;
        }
        return rec;
    };
    return RecordingCollectionCompileContext;
})();

exports.RecordingCollectionCompileContext = RecordingCollectionCompileContext;
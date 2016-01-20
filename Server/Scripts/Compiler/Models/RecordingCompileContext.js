var RecordingCompileContext = (function () {
    function RecordingCompileContext(audioUrl) {
        this._audioUrl = audioUrl;
    }
    Object.defineProperty(RecordingCompileContext.prototype, "AudioUrl", {
        get: function () {
            return this._audioUrl;
        },
        enumerable: true,
        configurable: true
    });
    return RecordingCompileContext;
})();

exports.RecordingCompileContext = RecordingCompileContext;
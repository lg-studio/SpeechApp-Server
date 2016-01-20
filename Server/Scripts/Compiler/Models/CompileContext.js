var CompileContext = (function () {
    function CompileContext() {
        this._boot = null;
        this._ratee = null;
        this._player = null;
        this._recordingCollection = null;
    }
    Object.defineProperty(CompileContext.prototype, "Boot", {
        get: function () {
            return this._boot;
        },
        set: function (value) {
            this._boot = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileContext.prototype, "Ratee", {
        get: function () {
            return this._ratee;
        },
        set: function (value) {
            this._ratee = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileContext.prototype, "Player", {
        get: function () {
            return this._player;
        },
        set: function (value) {
            this._player = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileContext.prototype, "RecordingCollection", {
        get: function () {
            return this._recordingCollection;
        },
        set: function (value) {
            this._recordingCollection = value;
        },
        enumerable: true,
        configurable: true
    });
    return CompileContext;
})();
exports.CompileContext = CompileContext;
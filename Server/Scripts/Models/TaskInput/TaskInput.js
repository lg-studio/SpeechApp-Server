var TaskInput = (function () {
    function TaskInput(json) {
        this._taskId = json.TaskId;
        this._ratings = [];
        this._answers = [];
        //TODO add ratings and answers one by one
    }
    Object.defineProperty(TaskInput.prototype, "TaskId", {
        get: function () {
            return this._taskId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskInput.prototype, "Answers", {
        get: function () {
            return this._answers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TaskInput.prototype, "Ratings", {
        get: function () {
            return this._ratings;
        },
        enumerable: true,
        configurable: true
    });
    return TaskInput;
})();

var AnswerInput = (function () {
    function AnswerInput(json) {
        this._nodeId = json.NodeId;
        this._fileNames = [];
        //TODO foreach
    }
    Object.defineProperty(AnswerInput.prototype, "NodeId", {
        get: function () {
            return this._nodeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnswerInput.prototype, "FileNames", {
        get: function () {
            return this._fileNames;
        },
        enumerable: true,
        configurable: true
    });
    return AnswerInput;
})();

var RatingInput = (function () {
    function RatingInput(json) {
        this._nodeId = json.NodeId;
        this._metrics = json.Metrics;
    }
    Object.defineProperty(RatingInput.prototype, "NodeId", {
        get: function () {
            return this._nodeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RatingInput.prototype, "Metrics", {
        get: function () {
            return this._metrics;
        },
        enumerable: true,
        configurable: true
    });
    return RatingInput;
})();

var MetricInput = (function () {
    function MetricInput(json) {
        this._id = json.Id;
        this._rating = json.Rating;
        this._type = json.Type;
    }
    Object.defineProperty(MetricInput.prototype, "Id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetricInput.prototype, "Rating", {
        get: function () {
            return this._rating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetricInput.prototype, "Type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return MetricInput;
})();

exports.TaskInput = TaskInput;
exports.AnswerInput = AnswerInput;
exports.RatingInput = RatingInput;
exports.MetricInput = MetricInput;
var DynamicContentUserFieldType = {
    Name: "NAME",
    PictureUrl: "PICTUREURL"
}

var DynamicContentRecordingFieldType = {
    AudioUrl: "AUDIOURL"
}

var DynamicContentEntityType = {
    Boot: "BOOT",
    Player: "PLAYER",
    Ratee: "RATEE",
    Recording: "RECORDING"
}

var MetricType = {
    Slider: "Slider",
    Thumbs: "Thumbs"
}

var MetricCategoryType = {
    Complexity : "Complexity",
    Fluency : "Fluency",
    Accuracy: "Accuracy",
    TaskAchievementScore: "TAS"
}

var NodeType = {
    Output: "Output",
    ContextualOutput: "ContextualOutput",
    Input: "Input"
}

var NodeItemType = {
    TextPrompt : "TextPrompt",
    AudioPrompt: "AudioPrompt",
    RatingInput: "RatingInput",
    RecordingInput: "RecordingInput"
}

var RatingType = {
    Regular : "Regular",
    TieBreaker: "TieBreaker"
}

var TaskStateType = {
    New : 0,
    WaitForFeedback: 1,
    Closed : 2
}

var AnswerStateType = {
    NotRated: 0,
    Rated: 1,
    WaitForTieBreaker: 2,
    Closed: 3
}

var RatingStateType = {
    New : 0,
    WaitForAcceptance: 1,
    WaitForTieBreaker: 2,
    Ignore: 3,
    Closed: 4
}

var UserType = {
    Regular: "Regular",
    Expert: "Expert",
    Admin: "Admin"
}

var UserLevel = {
    Regular : "RegularLevel",
    Expert: "ExpertLevel"
}

var LoginType = {
    Facebook : "Facebook",
    Twitter: "Twitter",
    Google: "Google",
    Basic: "Basic"
}

var UserAccountState = {
    NotActive : 0,
    Active: 1
}

var ActivationTokenState = {
    Pending: 0,
    Used: 1
}

exports.DynamicContentUserFieldType = DynamicContentUserFieldType;
exports.DynamicContentRecordingFieldType = DynamicContentRecordingFieldType;
exports.DynamicContentEntityType = DynamicContentEntityType;
exports.MetricType = MetricType;
exports.MetricCategoryType = MetricCategoryType;
exports.NodeType = NodeType;
exports.NodeItemType = NodeItemType;
exports.RatingType = RatingType;

exports.TaskStateType = TaskStateType;
exports.AnswerStateType = AnswerStateType;
exports.RatingStateType = RatingStateType;

exports.UserType = UserType;
exports.UserLevel = UserLevel;
exports.LoginType = LoginType;

exports.UserAccountState = UserAccountState;
exports.ActivationTokenState = ActivationTokenState;
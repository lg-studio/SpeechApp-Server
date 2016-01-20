var MobileResponseStatusCode = {
    Ok : 0,
    SessionTimeOut : 1,
    SessionNotAvailable: 2,
    LoginFail: 3,
    ServerError: 4,
    ResourceNotFound: 5,
    SignUpAccountAlreadyExists: 6,
    IncorrectPassword: 7,
    EmailNotRecognized : 8,
    AccountNotActivated: 9
};

MobileResponseMessage = [];
MobileResponseMessage[MobileResponseStatusCode.Ok] = "Ok";
MobileResponseMessage[MobileResponseStatusCode.SessionTimeOut] = "Session timeout";
MobileResponseMessage[MobileResponseStatusCode.SessionNotAvailable] = "No session available";
MobileResponseMessage[MobileResponseStatusCode.LoginFail] = "Invalid account or password.";
MobileResponseMessage[MobileResponseStatusCode.ServerError] = "Server Error";
MobileResponseMessage[MobileResponseStatusCode.ResourceNotFound] = "Resource not found";
MobileResponseMessage[MobileResponseStatusCode.SignUpAccountAlreadyExists] = "Account already exists";
MobileResponseMessage[MobileResponseStatusCode.IncorrectPassword] = "Incorrect password";
MobileResponseMessage[MobileResponseStatusCode.EmailNotRecognized] = "Email not recognized";
MobileResponseMessage[MobileResponseStatusCode.AccountNotActivated] = "Account is not activated";

var MobileResponseWrapper = (function () {
    var MobileResponseWrapper = function () {
    }
    MobileResponseWrapper.BuildResponse = function (statusCode, data) {
        var json = {
            StatusCode : statusCode,
            Message: MobileResponseMessage[statusCode],
            Data: data
        }

        return json;
    }
    return MobileResponseWrapper;
})();

exports.MobileResponseWrapper = MobileResponseWrapper;
exports.MobileResponseStatusCode = MobileResponseStatusCode;
var request = require("request-json");
var Enums = require('../../Core/Enums');

var GoogleLoginStrategy = (function () {
    function GoogleLoginStrategy() {
    }
GoogleLoginStrategy.Login = function (req, res, successAuthCallback, failAuthCallback) {
        var googleBaseURL = "https://www.googleapis.com/plus/v1/people/me";

        if (!req.body || !req.body.OauthToken) {
            failAuthCallback(req, res);
        }
        
        var client = request.newClient(googleBaseURL);
        client.get('?access_token=' + req.body.OauthToken, function (error, gooRes, body) {
            if (error || (body && body.error)) {
                failAuthCallback(req, res);
            }
            else {
                var response = {};
                
                if (!body.emails || body.emails.length == 0) {
                    failAuthCallback(req, res);
                    return;
                }
                
                var gooResponse = {};
                gooResponse.ProviderId = body.id;
                gooResponse.FirstName = body.displayName;
                gooResponse.LastName = body.displayName;
                gooResponse.LoginType = Enums.LoginType.Google;
                gooResponse.Email = body.emails[0].value;
                if (body.image && body.image.url) {
                    gooResponse.ProfileImageUrl = body.image.url;
                }
                
                successAuthCallback(req, res, gooResponse);
            }
        });
    }
    return GoogleLoginStrategy;
})();

module.exports = GoogleLoginStrategy;
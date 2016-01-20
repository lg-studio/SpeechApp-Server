var request = require("request-json");
var Enums = require('../../Core/Enums');

var FacebookLoginStrategy = (function () {
    function FacebookLoginStrategy() {
    }
    FacebookLoginStrategy.Login = function (req, res, successAuthCallback, failAuthCallback) {
        var facebookBaseURL = "https://graph.facebook.com/me";
        
        var client = request.newClient(facebookBaseURL);
        client.get('?fields=id,first_name,last_name,birthday,gender,picture{url},email&access_token=' + req.body.OauthToken, function (err, fbRes, body) {
            if (err || (body && body.error)) {
                failAuthCallback(req, res);
            }
            else {
                var fbResponse = {};
                fbResponse.ProviderId = body.id;
                fbResponse.FirstName = body.first_name;
                fbResponse.LastName = body.last_name;
                fbResponse.LoginType = Enums.LoginType.Facebook;
                fbResponse.Email = body.email;
                if (body.picture && body.picture.data && body.picture.data.url) {
                    fbResponse.ProfileImageUrl = body.picture.data.url;
                }
                
                successAuthCallback(req, res, fbResponse);
            }
        });
    };
    return FacebookLoginStrategy;
})();

module.exports = FacebookLoginStrategy;
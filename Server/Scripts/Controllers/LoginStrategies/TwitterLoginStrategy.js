var OAuth = require('oauth');
var Enums = require('../../Core/Enums');

var TwitterLoginStrategy = (function () {
    function TwitterLoginStrategy() {
    }
    TwitterLoginStrategy.Login = function (req, res, successAuthCallback, failAuthCallback) {
        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var apiKey = 'Ut5GeocQxYoKk2XmlPmFYDwGr';
        var apiKeySecret = '6uuu2Q4DHwH4GnH6qyQ3qMtybPU07TiEnBr7N076v7ICoBDbXB';
        var checkCredentialsUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
        var twitterBaseURL = "https://graph.facebook.com/me";
        
        if (!req.body || !req.body.OauthToken || !req.body.OauthTokenSecret) {
            failAuthCallback(req, res);
        }
        else {
            
            var oauth = new OAuth.OAuth(requestTokenUrl, accessTokenUrl, apiKey, apiKeySecret, '1.0A', null, 'HMAC-SHA1');
            
            oauth.get(
                checkCredentialsUrl,
            req.body.OauthToken,
            req.body.OauthTokenSecret, 
            function (err, data) {
                    if (err) {
                        failAuthCallback(req, res);
                    } 
                    else {
                        var datajson = JSON.parse(data);
                        twResponse = {};
                        twResponse.ProviderId = datajson.id;
                        twResponse.FirstName = datajson.name;
                        twResponse.LastName = datajson.name;
                        twResponse.LoginType = Enums.LoginType.Twitter;
                        twResponse.Email = null;
                        twResponse.ProfileImageUrl = datajson.profile_image_url;
                        
                        successAuthCallback(req, res, twResponse);
                    }
                });
        }
    };
    return TwitterLoginStrategy;
})();

module.exports = TwitterLoginStrategy;
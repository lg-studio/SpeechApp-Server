var BasicLoginStrategy = require('./BasicLoginStrategy');
var FacebookLoginStrategy = require('./FacebookLoginStrategy');
var TwitterLoginStrategy = require('./TwitterLoginStrategy');
var GoogleLoginStrategy = require('./GoogleLoginStrategy');

var LoginType = require('../../Core/Enums').LoginType;

var LoginStrategyFactory = (function () {
    function LoginStrategyFactory() {
    }
    LoginStrategyFactory.GetLoginStrategy = function (loginType) {
        switch (loginType) {
            case LoginType.Facebook:
                return FacebookLoginStrategy
            case LoginType.Twitter:
                return TwitterLoginStrategy;
            case LoginType.Google:
                return GoogleLoginStrategy;
            case LoginType.Basic:
                return BasicLoginStrategy;
        }
    };
    return LoginStrategyFactory;
})();

module.exports = LoginStrategyFactory;
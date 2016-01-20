var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Enums = require('../../Core/Enums');

var MobileResponseWrapper = require('../../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var BasicLoginStrategy = (function () {
    function BasicLoginStrategy() {
    }
    BasicLoginStrategy.Login = function (req, res, successAuthCallback, failAuthCallback) {
        var json = req.body;
        var userDAL = mongoose.model('User');
        userDAL.findOne({ Email: json.Email }).exec(function (err, user) {
            if (!user) {
                failAuthCallback(req, res, MobileResponseStatusCode.LoginFail);
                return;
            }
            if (user.AccountState == Enums.UserAccountState.NotActive) {
                failAuthCallback(req, res, MobileResponseStatusCode.AccountNotActivated);
                return;
            }

            var passwordHash = user.Password;
            var plainTextPassword = json.Password;

            var correctPassword = bcrypt.compareSync(plainTextPassword, passwordHash);
            
            if (correctPassword) {
                req.session.UserId = user._doc._id;
                successAuthCallback(req, res, user.GetDetailsWithNoSensitiveData());
            }
            else {
                failAuthCallback(req, res, MobileResponseStatusCode.LoginFail);
                return;
            }

        });
    };
    return BasicLoginStrategy;
})();

module.exports = BasicLoginStrategy;
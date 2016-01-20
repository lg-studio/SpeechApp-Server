var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Enums = require('../Core/Enums');
var LoginStrategyFactory = require('./LoginStrategies/LoginStrategyFactory');
var Config = require('../../Config/Config.global');

var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

function CreateNewUserAccountWithProperties(acountProperties, callback) {
    var defaultUserProperties = {
        ProviderId: null,
        LoginType: Enums.LoginType.None,
        UserName: null,
        Type: Enums.UserType.Regular,
        RatingSkills : 1,
        ProfileImageUrl : null,
        Email : null,
        FirstName: null,
        LastName: null,
        AccountState: Enums.UserAccountState.NotActive
    }
    
    var properties = _.extend(defaultUserProperties, acountProperties);
    
    var UserDAL = mongoose.model("User");
    
    var user = new UserDAL(properties);
    user.save(callback);
}

function SendActivationMail(user, callback){
    var ActivateAccountService = require('../Services/ActivateAccountService');
    var service = new ActivateAccountService();
    var email = user.Email;
    service.SendActivationEmail(email, callback);
}

function LoginWithProviderOrCreateNewAccount(req, res, providerData) {
    mongoose.model("User").findOne({ ProviderId : providerData.ProviderId, LoginType : providerData.LoginType }).
    exec(function (err, user) {
        if (err) {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.LoginFail, {});
            res.json(response);
            return;
        }
        if (!user) {
            CreateNewUserAccountWithProperties(providerData, function (err, user) {
                var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
                    UserDetails: user.GetDetailsWithNoSensitiveData()
                });
                res.json(response);
            });
        }
        else {
            req.session.UserId = user._id;
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
                UserDetails: user.GetDetailsWithNoSensitiveData()
            });
            res.json(response);
        }
    });
}

function BasicLoginCallback(req, res, properties) {
    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {
        UserDetails: properties
    });
    res.json(response);
};

function FailedAuthentificationCallback(req, res, statusCode){
    var response = MobileResponseWrapper.BuildResponse(statusCode, {});
    res.json(response);
}

function SignUp(req, res){
    var userProperties = JSON.parse(req.body.AccountData);
    mongoose.model('User').findOne({ Email : userProperties.Email }, function (err, user) {
        if (!user) {
            var passwordHash = bcrypt.hashSync(userProperties.Password);
            userProperties.Password = passwordHash;
            
            if (req.files.length > 0) {
                filename = req.files[0].filename;
                //TODO: Put Resource in config file
                userProperties.ProfileImageUrl = Config.Environment.BaseUrl + 'Resource/' + filename;
            }
            else {
                userProperties.ProfileImageUrl = Config.Environment.BaseUrl + 'Images/default.jpg';
            }
            
            CreateNewUserAccountWithProperties(userProperties, function (err, user) {
                SendActivationMail(user, function (err, statusCode) {
                    var response = MobileResponseWrapper.BuildResponse(statusCode, {});
                    res.json(response);
                });
            });
        }
        else {
            if (user.AccountState == Enums.UserAccountState.Active) {
                var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.SignUpAccountAlreadyExists, {});
                res.json(response);
            }
            else {
                SendActivationMail(user, function (err, statusCode) {
                    var response = MobileResponseWrapper.BuildResponse(statusCode, {});
                    res.json(response);
                });
            }
        }
    });
}

function PostLogin(req, res) {
    var loginType = req.body.LoginType;
    var loginStrategy = LoginStrategyFactory.GetLoginStrategy(loginType);

    var sucessAuthentificationCallback = (loginType == Enums.LoginType.Basic)? BasicLoginCallback : LoginWithProviderOrCreateNewAccount;
    
    loginStrategy.Login(req, res, sucessAuthentificationCallback, FailedAuthentificationCallback);
}

function ChangePassword(req, res) {
    var userId = req.session.UserId;
    var json = req.body;
    mongoose.model("User").findById({ _id: userId }, function (err, user) {
        if (err) {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.ServerError, {});
            res.json(response);
        }

        var passwordHash = user.Password;
        var plainTextOldPassword = json.OldPassword;
        
        var correctPassword = bcrypt.compareSync(plainTextOldPassword, passwordHash);
        
        if (correctPassword) {
            var newPasswordHash = bcrypt.hashSync(json.NewPassword);
            user.Password = newPasswordHash;
            user.save(function (err, user) {
                var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, user.GetDetailsWithNoSensitiveData());
                res.json(response);
            });
        }
        else {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.IncorrectPassword, user.GetDetailsWithNoSensitiveData());
            res.json(response);
        }
    });
}

function ActivateAccount(req, res) {
    var activationTokenKey = req.params.activationTokenKey;
    
    var ActivateAccountService = require('../Services/ActivateAccountService');
    var service = new ActivateAccountService();
    
    service.ActivateAccount(activationTokenKey, function (err, statusCode) {
        var filePath = process.cwd() + '/Html/AccountActivatedPage.html';
        res.sendfile(filePath);        
   
    });
}

function PasswordReset(req, res) {
    var email = req.body.Email;
    
    var ResetPasswordService = require('../Services/ResetPasswordService');
    var service = new ResetPasswordService();
    
    service.ResetPassword(email, function (err, statusCode) {
        var response = MobileResponseWrapper.BuildResponse(statusCode, {});
        res.json(response);
    });
}

function Logout(req, res) {
    req.session.UserId = null;
    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {});
    res.json(response);
}

exports.SignUp = SignUp;
exports.PostLogin = PostLogin;
exports.CreateNewUserAccountWithProperties = CreateNewUserAccountWithProperties;
exports.LoginWithProviderOrCreateNewAccount = LoginWithProviderOrCreateNewAccount;
exports.Logout = Logout;

exports.ResetPassword = PasswordReset;
exports.ChangePassword = ChangePassword;

exports.PasswordReset = PasswordReset;
exports.ActivateAccount = ActivateAccount;
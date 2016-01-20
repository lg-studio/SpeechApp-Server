var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt-nodejs');

var Config = require('../../Config/Config.global');
var Enums = require('../Core/Enums');
var EmailService = require('./EmailService');
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var ActivateAccountService = (function () {
    function ActivateAccountService() {
    }

    ActivateAccountService.prototype.SendActivationEmail = function (email, callback) {
        var this_ = this;
        mongoose.model('User').findOne({ Email: email }).exec(function (err, user) {
            if (err) {
                callback(err, MobileResponseStatusCode.ServerError);
                return;
            }
            if (user) {
                this_.GenerateActivationLink(user, function (err, activationLink) {
                    if (err) {
                        callback(err, MobileResponseStatusCode.ServerError);
                        return;
                    }

                    var subject = "Account activation";
                    var destinationEmail = user.Email;
                    var emailCompileTags = {
                        "{User.Name}" : user.FirstName,
                        "{ActivationLink}" : activationLink
                    }
                    var templateName = "AccountActivationTemplate.html";
                    var emailService = new EmailService();
                    
                    emailService.SendEmail(templateName, destinationEmail, subject, emailCompileTags , callback);
                });
            }
            else {
                callback(err, MobileResponseStatusCode.EmailNotRecognized);
            }
        });
    };

    ActivateAccountService.prototype.GenerateActivationLink = function (user, callback) {
        var baseUrl = Config.Environment.BaseUrl;
        var uniqueValue = (new ObjectID()).toString();
        var hash = bcrypt.hashSync(uniqueValue) + uniqueValue;
        var activationTokenKey = (new Buffer(hash)).toString('base64');
        var activationUrl = baseUrl + "ActivateAccount/"+ activationTokenKey;

        ActivationTokenDAL = mongoose.model('ActivationToken');
        
        var activationToken = new ActivationTokenDAL({
            TokenKey : activationTokenKey,
            UserId: user._id,
            Timestamp: Date.now(),
            State: Enums.ActivationTokenState.Pending
        });
        
        activationToken.save(function (err, activationToken) {
            callback(err, activationUrl)
        })
    };
    
    ActivateAccountService.prototype.ActivateAccount = function (activationTokenKey, callback) {
        var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;
        
        mongoose.model("ActivationToken").findOne({ TokenKey: activationTokenKey , State: Enums.ActivationTokenState.Pending },
            function (err, activationToken) {
                if (activationToken) {
                    var userId = activationToken.UserId;
                    mongoose.model("User").findById(userId).exec(err, function (err, user) {
                        if (user) {
                            user.AccountState = Enums.ActivationTokenState.Used;
                            user.save(function (err, user) {
                                activationToken.State = Enums.ActivationTokenState.Used;
                                activationToken.save(function (err) {
                                    callback(err, MobileResponseStatusCode.Ok);
                                });
                            });
                        }
                        else {
                            callback(err, MobileResponseStatusCode.ResourceNotFound);
                        }
                    });
                }
                else {
                    callback(err, MobileResponseStatusCode.ResourceNotFound);
                }
        });
    };

    return ActivateAccountService;
})();


module.exports = ActivateAccountService;
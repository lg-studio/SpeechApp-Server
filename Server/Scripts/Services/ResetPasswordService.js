var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt-nodejs');

var EmailService = require('./EmailService');
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var ResetPasswordService = (function () {
    function ResetPasswordService() {
    }

    ResetPasswordService.prototype.ResetPassword = function (email, callback) {
        var this_ = this;
        mongoose.model('User').findOne({ Email: email }).exec(function (err, user) {
            var temporaryPassword = this_.GenerateNewTemporaryPassword();
            
            if (user) {
                user.Password = bcrypt.hashSync(temporaryPassword);
                user.save(function (err, user) {
                    if (err) {
                        callback(err, MobileResponseStatusCode.ServerError);
                        return;
                    }
                    this_.SendPasswordRecoveryEmail(user, temporaryPassword, callback);
                });
            }
            else {
                callback(err, MobileResponseStatusCode.EmailNotRecognized);
            }
        });
    };
    
    ResetPasswordService.prototype.SendPasswordRecoveryEmail = function (user, temporaryPassword, callback){
        var subject = "Account password recovery";
        var destinationEmail = user.Email;
        var emailCompileTags = {
            "{User.Name}" : user.FirstName,
            "{User.Password}" : temporaryPassword
        }
        var templateName = "PasswordRecoveryTemplate.html";
        var emailService = new EmailService();
        
        emailService.SendEmail(templateName, destinationEmail, subject, emailCompileTags , callback);
    }

    ResetPasswordService.prototype.GenerateNewTemporaryPassword = function () {
        var randomString = (new ObjectID()).toString();
        var count = randomString.length;
        tempPassword = '';
        for (var i = 0; i < 7; i++) {
            tempPassword += randomString.charAt(Math.floor((Math.random() * count)));
        }
        return tempPassword;
    };
    return ResetPasswordService;
})();

module.exports = ResetPasswordService;
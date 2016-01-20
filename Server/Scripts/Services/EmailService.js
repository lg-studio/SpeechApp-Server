var Config = require('../../Config/Config.global');
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;

var EmailService = (function () {
    function EmailService() {
    }

    EmailService.prototype.SendEmail = function (templateName, destinationEmail, subject, emailCompileTags, callback) {
        var baseUrl = Config.Environment.BaseUrl;
        this.CompileEmailTemplate(templateName, emailCompileTags, function (err, emailContent) {
            if (err) {
                callback(err, MobileResponseStatusCode.ServerError);
                return;
            }
            
            var email = require("emailjs");
            var server = email.server.connect({
                user: Config.EmailProvider.User,
                password: Config.EmailProvider.Password,
                host: Config.EmailProvider.Smtp,
                tls: { ciphers: "SSLv3" }
            });
            
            var message = {
                text: "Welcome",
                from: Config.EmailProvider.User,
                to: destinationEmail,
                subject: subject,
                attachment:[ { data: emailContent, alternative: true }]
            };
            
            server.send(message, function (err) {
                //TODO: Log here if error
                callback(err, MobileResponseStatusCode.Ok);
            });
        });

    };

    EmailService.prototype.CompileEmailTemplate = function (templateName, emailCompileTags, callback) {
        var fs = require('fs');
        var path = require('path');
        
        var filePath = path.join(process.cwd(), 'Html/' + templateName);
        
        fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {
                var tags = Object.keys(emailCompileTags);
                tags.forEach(function (tagKey) {
                    data = data.replace(tagKey, emailCompileTags[tagKey]);
                });
                callback(null, data);
            } else {
                callback(err, undefined);
            }
        });    
    };

    return EmailService;
})();


module.exports = EmailService;
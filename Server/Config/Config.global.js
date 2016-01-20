var path = require('path');
var appDir = path.dirname(require.main.filename);

var Config = {
    LogConfig: {
        appenders: [
            {
                type: 'file',
                filename: appDir + '/Logs/States.log',
                category: 'States'
            }
        ]
    },
    EmailProvider: {
        User: "3angletechspeechapp@gmail.com",
        Password: "leuphana",
        Smtp: "smtp.gmail.com"
    }
}

var environmentType = process.argv[2];
var environment = null;

if (environmentType == "Heroku") {
    var environment = require('./EnvironmentConfig.heroku.js');
}
else {
    var environment = require('././EnvironmentConfig.development.js');
}

Config.Environment = environment;


module.exports = Config;
var Config = {
    LogConfig: {
        appenders: [
            {
                type: 'file',
                filename: __dirname + '/Logs/States.log',
                category: 'States'
            }
        ]
    },
    Environment : {
        Local : {
            DatabaseConnectionString : "mongodb://localhost:27017/SpeechApp",
            Port: 1337,
            BaseUrl: "http://86.123.141.37:1337/"
        },
        Heroku : {
            DatabaseConnectionString : "mongodb://angletech:TestTest01@ds055872.mongolab.com:55872/heroku_15r548xh",
            Port: 3000,
            BaseUrl: "https://leuphanaspeechapp.herokuapp.com/"
        }
    },
    RunningEnvironment : {}
}

exports.Config = Config;
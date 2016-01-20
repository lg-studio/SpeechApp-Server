require('newrelic');
var _ = require('underscore');
var Async = require('async');
var fs = require('fs');
var express = require('express');
var routes = require('./Scripts/Routes/Routes');
var http = require('http');
var path = require('path');
var log4js = require('log4js');
var mongoose = require('mongoose');

var Config = require('./Config/Config.global');
var ObjectID = require('mongodb').ObjectID;
var App = express();

log4js.configure(Config.LogConfig);

var logger = log4js.getLogger('States');

var EnvironmentConfig = Config.Environment;

var MediaController = require('./Scripts/Controllers/MediaController');
var TaskTemplateController = require('./Scripts/Controllers/TaskTemplateController');
var TaskController = require('./Scripts/Controllers/TaskController');
var TaskInputController = require('./Scripts/Controllers/TaskInputController');
var UserController = require('./Scripts/Controllers/UserController');

// all environments

App.set('port', process.env.PORT || EnvironmentConfig.Port);
App.use(express.logger('dev'));
App.use(express.json());
App.use(express.urlencoded());
App.use(express.methodOverride());

var session = require('express-session');
App.use(session({
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true
}));

App.use(App.router);

App.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == App.get('env')) {
    App.use(express.errorHandler());
}

var connect = function () {
    mongoose.connect(EnvironmentConfig.DatabaseConnectionString);
}

connect();

mongoose.connection.on('open', console.log);
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnect', connect);

App.use('/Images', express.static(__dirname + '/Resources/Images'));

var MongooseInitializer = require('./Scripts/Utils/MongooseInitializer');
MongooseInitializer.LoadModels();

App.get('/CertificatesNavigationTree', routes.GetCertificatesNavigationTree);
App.get('/MenuItems', routes.GetMenuItems);
App.get('/RebuildTask/:taskId', routes.RebuildTask);

App.get('/TaskNavigationTree/:categoryId', routes.GetTaskNavigationTree);
App.get('/TaskNavigationTree/:categoryId/:subcategoryId', routes.GetTaskNavigationTree);
App.get('/TaskStructure/:taskTemplateId', TaskTemplateController.CreateNewTaskInstance);
App.get('/NodeStructure/:taskId/:nodeId', TaskController.GetNodeStructure);

App.post('/TaskInput', MediaController.MulterUploader , MediaController.UploadRecording , TaskInputController.PostTaskInput);


var UserProfileController = require('./Scripts/Controllers/UserProfileController');
App.get('/ProfileBio', UserProfileController.GetProfileBio);
App.get('/ProfileFeedbackStatistics', UserProfileController.GetProfileFeedbackStatistics);
App.get('/ProfileActivities/:offset/:count', UserProfileController.GetProfileActivities);
App.get('/ProfileCompetences', UserProfileController.GetProfileCompetences);
App.post('/Logout', UserController.Logout);

App.get('/SessionExists', routes.SessionState);


App.get('/CleanDB', function (req, res) {
    var callback = function (err) { };
    mongoose.model("Answer").remove({}, callback);
    mongoose.model("Rating").remove({}, callback);
    mongoose.model("Recording").remove({}, callback);
    mongoose.model("Task").remove({}, callback);
    res.json({});
});

App.post('/UpdateNotificationKey', function (req, res) {
    var mobileNotificationKey = req.body.MobileNotificationKey;
    var mobileType = req.body.MobileType;
    //TODO: 
});


App.get('/Uploads/:id', MediaController.DownloadRecording);
App.get('/Resource/:id', MediaController.GetResource);
App.post('/Resource', MediaController.MulterUploader, MediaController.PostResource, function (req, res) {
    res.json({});
});

App.post('/Login', UserController.PostLogin);
App.post('/SignUp', MediaController.MulterUploader, MediaController.PostResource, UserController.SignUp);
App.get('/ActivateAccount/:activationTokenKey', UserController.ActivateAccount);
App.post('/PasswordReset', UserController.PasswordReset);
App.post('/UpdateBio', MediaController.MulterUploader, MediaController.PostResource, UserProfileController.UpdateBio);
App.post('/ResetPassword', UserController.ResetPassword);
App.post('/ChangePassword', UserController.ChangePassword);



http.createServer(App).listen(process.env.PORT || App.get('port'), function () {
    console.log('Express server listening on port ' + (process.env.PORT || App.get('port')));
});
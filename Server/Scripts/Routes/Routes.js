var mongoose = require('mongoose');
var _ = require('underscore');
var TaskTemplateController = require('../Controllers/TaskTemplateController');
var MobileResponseWrapper = require('../Utils/MobileResponseWrapper').MobileResponseWrapper;
var MobileResponseStatusCode = require('../Utils/MobileResponseWrapper').MobileResponseStatusCode;
var TaskTemplateController = require('../Controllers/TaskTemplateController');
var TaskController = require('../Controllers/TaskController');
var TaskInputController = require('../Controllers/TaskInputController');
var UserController = require('../Controllers/UserController');

var MediaController = require('../Controllers/MediaController');

function GetTaskNavigationTree(req, res) {
    mongoose.model("Topic").findById("55e01cad491e454550dc2b5a").exec(function (err, topic) {
        topic.BuildMobileJson(req.session.UserId, function (err, topicJson) {
            var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, topicJson);
            res.json(response);
        });
    });
}

function GetMenuItems(req, res) {
    var menuJson = {
        "MenuItems" : [
            {
                "Name" : "Home",
                "Type" : "Home"
            },
            {
                "Name" : "My Profile",
                "Type" : "Profile"
            },
            {
                "Name" : "Notifications",
                "Type" : "Notifications"
            },
            {
                "Name" : "Log Out",
                "Type" : "LogOut"
            }
        ]
    };
    
    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, menuJson);
    res.json(response);
}

function GetCertificatesNavigationTree(req, res) {
    var navigationTree = {
        "Certificates" :
 [
            {
                "Id" : "1234",
                "Name" : "Cambridge Certificates",
                "Subcategories" :
 [
                    {
                        "Id"   : "23121",
                        "Name" : "IELTS"
                    },
                    {
                        "Id"   : "12312",
                        "Name" : "FCE"
                    },
                    {
                        "Id"   : "43132131",
                        "Name" : "CAE"
                    },
                    {
                        "Id"   : "34131212",
                        "Name" : "CPE"
                    }
                ]
            },
            {
                "Id" : "371831",
                "Name" : "TOEFL - iBT",
                "Subcategories" :
 [
                ]
            },
            {
                "Id" : "371831",
                "Name" : "School's Language Lab",
                "Subcategories" :
 [
                ]
            },
            {
                "Id" : "371831",
                "Name" : "Rating",
                "Subcategories" :
 [
                ]
            }
        ]
    };
    
    
    var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, navigationTree);
    res.json(response);
}

function SessionState(req, res){
    if (req.session.UserId) {
        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.Ok, {});
        res.json(response);
    }
    else {
        var response = MobileResponseWrapper.BuildResponse(MobileResponseStatusCode.SessionNotAvailable, {});
        res.json(response);
    }
}

function RebuildTask(req, res){
 var response = {
    "StatusCode" : 0,
    "Message" : "",
    "Data":
        {
          "TaskId" : "552d077f00c97637a01eeeee",
          "Items" :
            [
                {
                    "Id": 1,
                    "NodeId" : 2,
                    "Type": "TextPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 1,
                        "PictureUrl": "http://46.4.214.252:8080/dobre.png",
                        "Text": "Hi there! Let's make a Software Engineering interview!",
                        "Name": "Catalin Andrei Dobre"
                    }
                },
                {
                    "Id": 3,
                    "NodeId" : 4,
                    "Type": "AudioPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 5,
                        "PictureUrl": "http://46.4.214.252:8080/dobre.png",
                        "HeaderText": "First let's find out something about you.",
                        "Name": "Catalin Andrei Dobre",
                        "AudioUrl" : "https://leuphanaspeechapp.herokuapp.com/Resource/55cb2047e2758cb407bc0aa0"
                    }
                },
                {
                    "Id": 5,
                    "NodeId": 6,
                    "Type": "AudioPrompt",
                    "Properties":
                    {
                        "PersonalMessage" : true,
                        "UserId": 1222,
                        "Delay" : 5,
                        "PictureUrl": "http://46.4.214.252:8080/paraschiv.png",
                        "HeaderText": "This is the answer from Ionut Cristian Paraschiv.",
                        "Name": "Ionut Paraschiv",
                        "AudioUrl" : "https://leuphanaspeechapp.herokuapp.com/Resource/55cb2047e2758cb407bc0aa0"
                    }
                },
                {
                    "Id": 7,
                    "NodeId" : 8,
                    "Type": "TextPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 1,
                        "PictureUrl": "http://46.4.214.252:8080/pricope.png",
                        "Text": "The ratings for Ionut are 80% in Speaking, 75% in Listening",
                        "Name": "Anonymous"
                    }
                },
                {
                    "Id": 11,
                    "NodeId" : 12,
                    "Type": "TextPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 1,
                        "PictureUrl": "http://46.4.214.252:8080/dobre.png",
                        "Text": "Now let's get more technical",
                        "Name": "Catalin Andrei Dobre"
                    }
                },
                {
                    "Id": 13,
                    "NodeId" : 14,
                    "Type": "AudioPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 5,
                        "PictureUrl": "http://46.4.214.252:8080/dobre.png",
                        "HeaderText": "Please answer my question.",
                        "Name": "Catalin Andrei Dobre",
                        "AudioUrl" : "https://leuphanaspeechapp.herokuapp.com/Resource/55cb2047e2758cb407bc0aa0"
                    }
                },
                {
                    "Id": 15,
                    "NodeId": 16,
                    "Type": "AudioPrompt",
                    "Properties":
                    {
                        "PersonalMessage" : true,
                        "UserId": 1222,
                        "Delay" : 5,
                        "PictureUrl": "http://46.4.214.252:8080/paraschiv.png",
                        "HeaderText": "This is the answer from Ionut Cristian Paraschiv.",
                        "Name": "Ionut Paraschiv",
                        "AudioUrl" : "https://leuphanaspeechapp.herokuapp.com/Resource/55cb2047e2758cb407bc0aa0"
                    }
                },
                {
                    "Id": 17,
                    "NodeId" : 18,
                    "Type": "TextPrompt",
                    "Properties":
                    {
                        "UserId": 1222,
                        "Delay" : 1,
                        "PictureUrl": "http://46.4.214.252:8080/pricope.png",
                        "Text": "The ratings for Ionut are 80% in Speaking, 75% in Listening",
                        "Name": "Anonymous"
                    }
                },
                {
                    "Id": 19,
                    "NodeId" : 20,
                    "Type": "TextPrompt",
                    "Properties":
                    {
                        "Delay" : 0,
                        "UserId": 1222,
                        "PictureUrl": "http://46.4.214.252:8080/dobre.png",
                        "Text": "Thank you for your answers!",
                        "Name": "Catalin Andrei Dobre"
                    }
                }
            ]
      }
    }
    res.json(response);
}

exports.GetCertificatesNavigationTree = GetCertificatesNavigationTree;
exports.GetMenuItems = GetMenuItems;
exports.GetTaskNavigationTree = GetTaskNavigationTree;
exports.SessionState = SessionState;
exports.RebuildTask = RebuildTask;
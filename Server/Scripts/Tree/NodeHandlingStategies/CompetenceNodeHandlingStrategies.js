var _ = require('underscore');
var mongoose = require('mongoose');
var TaskStateType = require('../../Core/Enums').TaskStateType;

var FetchProperties = function (node, context, callback) {
    if (node.ResourceId) {
        mongoose.model("Competence").findById(node.ResourceId).exec(function (err, competence) {
            node.Properties = {
                Name: competence.Name,
                Description: competence.Description
            };
            callback(null, node);
        });
    }
    else {
        callback(null, node);
    }
};

var ComputeRating = function (node, context, callback) {
    if (node.IsLeaf) {
        mongoose.model("Task").find({
            PlayerId: context.PlayerId,
            "Template.CompetenceId" : node.ResourceId,
            State: TaskStateType.Closed,
        }).exec(function (err, tasks) {
            var ratingsSum = _.reduce(tasks,
                function (memo, task) {
                return memo + task._doc.TAS;
            }, 0);
            
            if (tasks.length > 0) {
                node.Properties.Rating = ratingsSum / tasks.length;
            }
            else {
                node.Properties.Rating = 0;
            }
            callback(null, node);
        });
    }
    else {
        var ratingsSum = _.reduce(node.Children,
                function (memo, child) {
            return memo + child.Properties.Rating;
        }, 0);
        node.Properties.Rating = ratingsSum / node.Children.length;
        
        callback(null, node);
    }
}

var BuildJsonForMobile = function (node, context, callback) {
    var json = {
        Name: node.Properties.Name,
        Description: node.Properties.Description,
        Rating: node.Properties.Rating,
        Children: []
    };

    if (!node.IsLeaf) {
        node.Children.forEach(function (child) {
            json.Children.push(child.Properties.MobileJsonRepresentation);
        });
    }

    node.Properties.MobileJsonRepresentation = json;
    callback(null, node);
}

exports.FetchProperties = FetchProperties;
exports.ComputeRating = ComputeRating;
exports.BuildJsonForMobile = BuildJsonForMobile;
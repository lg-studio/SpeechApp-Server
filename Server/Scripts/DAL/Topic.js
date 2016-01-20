var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Async = require('async');
var Enums = require('../Core/Enums');

var Topic = new Schema({
    TopicList: { type: Schema.Types.Mixed }
});

function computeAverage(values){
    var valuesSum = _.reduce(values,
        function (memo, value) {
            return memo + value;
        }, 0);
    
    var average = 0;
    if (values.length > 0) {
        average = valuesSum / values.length;
    }
    return average;
}

function BuildTopicTaskTemplateJsonForMobile(taskTemplate, tasks){
    var values = _.map(tasks, function (task) { return task._doc.TAS });
    var averageRating = computeAverage(values);
    
    var json = {
        Id: taskTemplate._id,
        Name: taskTemplate.Caption,
        Type: taskTemplate.Type,
        IconUrl: taskTemplate.IconUrl,
        Properties: {
            Retries: tasks.length,
            AverageRating: averageRating,
        }
    }
    return json;
}

function BuildTopicJsonForMobile(topic){
    var values = _.map(topic.TaskTemplates, function (taskTemplates) { return taskTemplates.Properties.AverageRating });
    var averageRating = computeAverage(values);
    
    topic.Properties = {
        AverageScore: averageRating
    }
}

function BuildTopicListJsonForMobile(topics){
    var json = {
        TopicList: []
    }
    topics.TopicList.forEach(function (topic) {
        var topicJson = {
            Name: topic.Name,
            IconUrl: topic.IconUrl,
            Properties: topic.Properties,
            TaskTemplates: []
        }
        topic.TaskTemplates.forEach(function (taskTemplate) {
            var taskTemplateJson = {
                Id: taskTemplate.Id,
                Type: taskTemplate.Type,
                Name: taskTemplate.Name,
                IconUrl: taskTemplate.IconUrl,
                Properties: taskTemplate.Properties
            }
            topicJson.TaskTemplates.push(taskTemplateJson);
        });
        json.TopicList.push(topicJson);
    });
    return json;
}

Topic.methods = {
    BuildMobileJson: function (playerId, callback){
        var this_ = this;
        Async.eachSeries(this.TopicList, function (topic, cb) {
            topic.TaskTemplates = [];
            Async.eachSeries(topic.TaskTemplatesIds, function (taskTemplateId, cb2) {
                mongoose.model("TaskTemplate").findById(taskTemplateId).exec(function (err, taskTemplate) {
                    mongoose.model("Task").find({
                        "Template._id" : taskTemplateId ,
                        State: Enums.TaskStateType.Closed ,
                        PlayerId: playerId
                    }).exec(function (err, tasks) {
                        json = BuildTopicTaskTemplateJsonForMobile(taskTemplate, tasks);
                        topic.TaskTemplates.push(json);
                        cb2(null, topic);
                    });

                });
            }, function (err, results) {
                BuildTopicJsonForMobile(topic)
                cb(null, topic);
            });
        }, function (err, results) {
            var json = BuildTopicListJsonForMobile(this_);
            callback(null, json);
        });
    }
}

mongoose.model("Topic", Topic, "Topics");
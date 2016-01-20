var assert = require("assert");
var mongoose = require('mongoose');
var DemoDataImporter = require('../Utils/DemoDataImporter');
var CompetenceNodeHandlingStrategies = require('../../Scripts/Tree/NodeHandlingStategies/CompetenceNodeHandlingStrategies');

describe('TreeWalkTest', function () {
    before(function (done) {
        var MongooseInitializer = require('../../Scripts/Utils/MongooseInitializer');
        MongooseInitializer.LoadModels();
        //TODO: put connection string in Config file
        mongoose.connect("mongodb://localhost:27017/SpeechApp-Test", function () {
            DemoDataImporter.StartImport(__dirname, function (err, data) {
                done();
            });
        });
    });

    it('Should calculate properly the rating for each node in the Competence Tree', function (done) {
        TraverseTreeAndComputeRatings(function (err, tree) {
            ValidateRatings(tree, done);
        });
    });
});

var TraverseTreeAndComputeRatings = function (callback) {
    var taskStructureId = require('./DemoData/TreeStructure')[0]._id;
    var context = {
        PlayerId: require('./DemoData/User')[0]._id
    }
    
    mongoose.model('TreeStructure').findById(taskStructureId).exec(function (err, tree) {
        tree.FetchTree(function (err, tree) {
            tree.WalkTree(CompetenceNodeHandlingStrategies.FetchProperties, null, function (err, tree) {
                tree.WalkTree(CompetenceNodeHandlingStrategies.ComputeRating, context, callback);
            });
        });
    });
}

function ValidateRatings(tree, callback) {
    var expectedTree = {
        Rating: 0.6,
        Children: [
            {
                Rating: 0.3,
                Children: [
                    {
                        Rating: 0.1,
                        Children: []
                    },
                    {
                        Rating: 0.2,
                        Children: []
                    },
                    {
                        Rating: 0.6,
                        Children: []
                    }
                ]
            },
            {
                Rating: 0.9,
                Children: [
                    {
                        Rating: 0.8,
                        Children: []
                    },
                    {
                        Rating: 1,
                        Children: []
                    }
                ]
            }
        ]
    };
    
    NodeHasExpectedProperties = function (node, expectedNodeProperties) {
        var ratingTreshold = 0.001;
        if (node.Children.length != expectedNodeProperties.Children.length) {
            assert.fail(expectedNodeProperties.Children.length, node.Children.length, "Node " + node._id.toString() + " number of children,.")
            return false;
        }
        if (Math.abs(node.Properties.Rating - expectedNodeProperties.Rating) > ratingTreshold) {
            assert.fail(expectedNodeProperties.Rating, node.Properties.Rating, "Node " + node._id.toString() + " rating.")
            return false;
        }
        return true;
    }
    
    TreeHasExpectedProperties = function (rootNode, expectedNodeProperties) {
        if (NodeHasExpectedProperties(rootNode, expectedNodeProperties)) {
            if (rootNode.Children.length == 0) {
                return true;
            }
            else {
                for (i = 0; i < rootNode.Children.length; i++) {
                    var match = TreeHasExpectedProperties(rootNode.Children[i], expectedNodeProperties.Children[i]);
                    if (match == false) {
                        return false;
                    }
                }
                return true;
            }
        }
        else {
            return false;
        }
    };
    debugger;
    TreeHasExpectedProperties(tree.RootNode, expectedTree);
    callback(null, tree);
}

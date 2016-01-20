var mongoose = require('mongoose')
var Async = require('Async');

function GetCollectionsToImport(collectionsPath){
    var collections = [];
    var fs = require('fs');
    fs.readdirSync(collectionsPath).forEach(function (file) {
        var filename = file.substring(0, file.indexOf('.js'));
        collections.push(filename);
    });
    return collections;
}

function StartImport(rootPath, callback) {
    var demoDataPath = rootPath + '/DemoData/';   
    var collectionsToImport = GetCollectionsToImport(demoDataPath);
    Async.eachSeries(
        collectionsToImport,
        function (collectionName, cb) {
            var collectionDemoData = require(demoDataPath + collectionName);
            mongoose.model(collectionName).remove({}).exec(function (err, res) {
                mongoose.model(collectionName).collection.insert(collectionDemoData,
                function (err, data) {
                    cb(err, data);
                });
            })
        },
        function (err, results) {
            callback(null, results);
        });
}

exports.StartImport = StartImport;
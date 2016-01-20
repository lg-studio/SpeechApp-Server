var stream = require("stream");
var mongoose = require("mongoose");
var multer = require('multer');
var Async = require("async");

var storage = multer.memoryStorage();
var uploader = multer({ storage: storage });

var UploadRecording = function (req, res, next) {
    var recordingDAL = mongoose.model("Recording");
    Async.eachSeries(req.files, function (file, cb) {
        var recording = new recordingDAL({
            Data: file.buffer
        });
        
        recording.save(function (err, record) {
            file.filename = record._id.toString();
            cb(err, record);
        });
    }, function () {
        next();
    });
}

function BufferedDownload(req, res) {
    id = req.params.id;
    
    mongoose.model("Recording").findById(id).exec(function (err, recording) {
        res.setHeader('Accept-Rages', 'bytes');
        res.setHeader('Content-Length', recording.Data.buffer.length);
        res.setHeader('Content-Disposition', 'inline; filename=' + id + '.m4a');
        res.setHeader('Content-Type', 'audio/mp4');
        res.removeHeader('Transfer-Encoding', '');
        res.end(new Buffer(recording.Data.buffer));
    });
}

function StreamedDownload(req, res) {
    id = req.params.id;
    
    var range = req.headers.range;
    
    mongoose.model("Recording").findById(id).exec(function (err, recording) {
        var readableStream = new stream.Readable();
        readableStream.push(recording.Data.buffer);
        readableStream.push(null);
        readableStream.pipe(res);
    });
}

function GetResource(req, res) {
    id = req.params.id;
    
    var range = req.headers.range;
    
    mongoose.model("Resource").findById(id).exec(function (err, resource) {
        var readableStream = new stream.Readable();
        readableStream.push(resource.Data.buffer);
        readableStream.push(null);
        readableStream.pipe(res);
    });
}

function PostResource(req, res, next){
    var resourceDAL = mongoose.model("Resource");
    Async.eachSeries(req.files, function (file, cb) {
        var resource = new resourceDAL({
            MimeType: file.mimetype,
            Data: file.buffer
        });
        
        resource.save(function (err, resource) {
            file.filename = resource._id.toString();
            cb(err, resource);
        });
    }, function () {
        next();
    });
}


exports.GetResource = GetResource;
exports.PostResource = PostResource;

exports.MulterUploader = uploader.array("file");
exports.UploadRecording = UploadRecording;
exports.DownloadRecording = StreamedDownload;
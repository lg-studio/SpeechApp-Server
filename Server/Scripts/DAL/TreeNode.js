var Async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreeNode = new Schema({
    ParentId: { type: Schema.Types.ObjectId },
    Type: { type: Schema.Types.String },
    ResourceId: { type: Schema.Types.ObjectId },
});

TreeNode.methods = {
    FetchChildren : function (callback){
        var this_ = this;
        mongoose.model('TreeNode').find({ ParentId: this._id }).sort({_id: 'asc'}).exec(function (err, children) {
            Async.eachSeries(children, function (child, cb) {
                child.Parent = this_;
                child.FetchChildren(cb);
            }, function () {
                this_.Children = children;
                callback(null, children);
            });
        });
    },

    WalkDFS: function (nodeHandlingStrategy, context, callback){
        var this_ = this;
        Async.eachSeries(
            this.Children,
            function (child, cb) {
                child.WalkDFS(nodeHandlingStrategy, context, cb);
            },
            function (err, results) {
                nodeHandlingStrategy(this_, context, callback);
            });
    },

    ToString: function (){
        var pid = (this.ParentId)? this.ParentId.toString(): "null";
        var content = "Id: " + this._id.toString() + "\n";
        content += "ParentId: " + pid + "\n";
        content += "Type: " + this.Type + "\n";
        content += "ResourceId: " + this.ResourceId.toString() + "\n";
        
        this.Children.forEach(function (child, index){
            content += "Child " + index + ":" + child._id.toString() + "\n";
        });
        return content;
    }
}

TreeNode.virtual('IsLeaf').get(function () {
    return (this.Children.length == 0)? true: false;
});

TreeNode.virtual('Parent').set(function (parent) {
    this._parent = parent;
});

TreeNode.virtual('Parent').get(function () {
    return this._parent;
});

TreeNode.virtual('Children').set(function (children) {
    this._children = children;
});

TreeNode.virtual('Children').get(function () {
    return this._children;
});

TreeNode.virtual('Properties').set(function (properties) {
    this._properties = properties;
});

TreeNode.virtual('Properties').get(function (properties) {
    return this._properties;
});

mongoose.model("TreeNode", TreeNode, "TreeNodes");
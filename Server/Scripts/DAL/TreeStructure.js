var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreeStructure = new Schema({
    RootNodeId: { type: Schema.Types.ObjectId },
});

TreeStructure.methods = {
    FetchTree : function (callback) {
        var this_ = this;
        mongoose.model("TreeNode").findById(this.RootNodeId).exec(function (err, rootNode) {
            rootNode.FetchChildren(function (err, children) {
                this_.RootNode = rootNode;
                callback(null, this_);
            });
        });
    },

    WalkTree : function (nodeHandlingStrategy, context, callback){
        var this_ = this;
        this.RootNode.WalkDFS(nodeHandlingStrategy, context, function (err, node) {
            callback(null, this_);
        });
    }
}

TreeStructure.virtual("RootNode").get(function () {
    return this._rootNode;
});
TreeStructure.virtual("RootNode").set(function (rootNode) {
    this._rootNode = rootNode;
});

mongoose.model("TreeStructure", TreeStructure, "TreeStructures");
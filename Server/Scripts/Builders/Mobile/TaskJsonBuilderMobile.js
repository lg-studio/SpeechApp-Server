var _ = require('underscore');

var NodeJsonBuilderMobile = require('./NodeJsonBuilderMobile').NodeJsonBuilderMobile;

var TaskJsonBuilderMobile = (function () {
    function ana(param1,param2){
    }
    var TaskJsonBuilderMobile = function () {

    }
    
    TaskJsonBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        var json = []
        var nodeBuilder = new NodeJsonBuilderMobile();
        _.forEach(document.Nodes, function (node, index) {
            var nodeItemsList = nodeBuilder.BuildJson(node, compileContext);
            _.forEach(nodeItemsList, function (nodeItem, index) {
                json.push(nodeItem);
            });
        })
        
        return json;
    };
    return TaskJsonBuilderMobile;
})();

exports.TaskJsonBuilderMobile = TaskJsonBuilderMobile;
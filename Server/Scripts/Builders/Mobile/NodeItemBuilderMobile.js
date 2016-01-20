var _ = require('underscore');
var NodeItemPropertiesBuilderFactory = require('./NodeItemPropertiesBuilderFactory').NodeItemPropertiesBuilderFactory;

var NodeItemBuilderMobile = (function () {
    var NodeItemBuilderMobile = function () {
    }
    NodeItemBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        var json = {};
        json['Id'] = document.Id;
        json['Type'] = document.Type;
        
        var propertiesBuilder = NodeItemPropertiesBuilderFactory.Create(document.Type);
        json['Properties'] = propertiesBuilder.BuildJson(document.Properties, compileContext);
        return json;
    }
    
    return NodeItemBuilderMobile;
})();
exports.NodeItemBuilderMobile = NodeItemBuilderMobile;
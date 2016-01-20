var _ = require('underscore');
var PropertiesBuilderFactory = require('./PropertiesBuilderFactory').PropertiesBuilderFactory;

var NodeJsonBuilderMobile = (function () {
    var NodeJsonBuilderMobile = function () {
    }
    
    NodeJsonBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        var propertiesBuilder = PropertiesBuilderFactory.Create(document.Type);
        var json = []
        var nodeItemList = propertiesBuilder.BuildJson(document, compileContext);
        _.forEach(nodeItemList, function (nodeItem, index) {
            json.push(nodeItem);
        })
        return json;
    }
    return NodeJsonBuilderMobile;
})();
exports.NodeJsonBuilderMobile = NodeJsonBuilderMobile;
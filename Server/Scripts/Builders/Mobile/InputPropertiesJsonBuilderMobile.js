var _ = require('underscore');
var NodeItemBuilderMobile = require('./NodeItemBuilderMobile').NodeItemBuilderMobile;

var InputPropertiesJsonBuilderMobile = (function () {
    var InputPropertiesJsonBuilderMobile = function () {
    }
    InputPropertiesJsonBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        var json = [];
        var properties = document.Properties;
        var nodeItemBuilder = new NodeItemBuilderMobile();
        _.forEach(properties.Items, function (item, index) {
            var itemJson = nodeItemBuilder.BuildJson(item, compileContext);
            itemJson['NodeId'] = document.Id;
            json.push(itemJson);
        });
        return json;
    }
    return InputPropertiesJsonBuilderMobile;
})();
exports.InputPropertiesJsonBuilderMobile = InputPropertiesJsonBuilderMobile;
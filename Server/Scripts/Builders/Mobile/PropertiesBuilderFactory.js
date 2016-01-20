var _ = require('underscore');
var OutputPropertiesJsonBuilderMobile = require('./OutputPropertiesJsonBuilderMobile').OutputPropertiesJsonBuilderMobile;
var ContextualOutputPlaceholderJsonBuilderMobile = require('./ContextualOutputPlaceholderJsonBuilderMobile').ContextualOutputPlaceholderJsonBuilderMobile;
var InputPropertiesJsonBuilderMobile = require('./InputPropertiesJsonBuilderMobile').InputPropertiesJsonBuilderMobile;
var NodeType = require('../../Core/Enums').NodeType;

var PropertiesBuilderFactory = (function () {
    var PropertiesBuilderFactory = function () {
    }
    PropertiesBuilderFactory.Create = function (type) {
        switch (type) {
            case NodeType.Output:
                return new OutputPropertiesJsonBuilderMobile();
            case NodeType.ContextualOutput:
                return new ContextualOutputPlaceholderJsonBuilderMobile();
            case NodeType.Input:
                return new InputPropertiesJsonBuilderMobile();
            default:
                throw Error("Property type not supported");
        }
    }
    return PropertiesBuilderFactory;
})();
exports.PropertiesBuilderFactory = PropertiesBuilderFactory;
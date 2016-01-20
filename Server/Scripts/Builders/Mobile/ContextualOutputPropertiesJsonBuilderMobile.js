var _ = require('underscore');
var NodeItemBuilderMobile = require('./NodeItemBuilderMobile').NodeItemBuilderMobile;
var NodeItemType = require('../../Core/Enums').NodeItemType;

var ContextualOutputPropertiesJsonBuilderMobile = (function () {
    var ContextualOutputPropertiesJsonBuilderMobile = function () {
    }
    ContextualOutputPropertiesJsonBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        if (compileContext.Ratee == null) {
            return [];
        }

        var json = [];
        var properties = document.Properties;
        var nodeItemBuilder = new NodeItemBuilderMobile();
        _.forEach(properties.Items, function (item, index) {
            //TODO: Rewrite this in more elegant way
            function BuildItem(){
                var itemJson = nodeItemBuilder.BuildJson(item, compileContext);
                itemJson['NodeId'] = document.Id;
                json.push(itemJson);
            }

            if (item.Type == NodeItemType.AudioPrompt) {
                for (i = 0; i < compileContext.RecordingCollection.Count; i++) {
                    BuildItem();
                }
            }
            else {
                BuildItem();
            }
        });
        return json;
    }
    return ContextualOutputPropertiesJsonBuilderMobile;
})();

exports.ContextualOutputPropertiesJsonBuilderMobile = ContextualOutputPropertiesJsonBuilderMobile;
var _ = require('underscore');

var ContextualOutputPlaceholderJsonBuilderMobile = (function () {
    var ContextualOutputPlaceholderJsonBuilderMobile = function () {
    }
    ContextualOutputPlaceholderJsonBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        var json = [];
        var nodeItemJson = {};
        nodeItemJson['Id'] = document.Id;
        nodeItemJson['Type'] = "FeedbackRequired";
        nodeItemJson['Properties'] = {
            LinkedNodeId : document.Properties.LinkedNodeId
        }
        
        json.push(nodeItemJson);
        return json;
    }
    return ContextualOutputPlaceholderJsonBuilderMobile;
})();

exports.ContextualOutputPlaceholderJsonBuilderMobile = ContextualOutputPlaceholderJsonBuilderMobile;
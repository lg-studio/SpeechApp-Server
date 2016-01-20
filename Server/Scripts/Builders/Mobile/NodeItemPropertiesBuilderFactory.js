var _ = require('underscore');
var TextPromptPropertiesBuilderMobile = require('./TextPromptPropertiesBuilderMobile').TextPromptPropertiesBuilderMobile;
var AudioPromptPropertiesBuilderMobile = require('./AudioPromptPropertiesBuilderMobile').AudioPromptPropertiesBuilderMobile;
var RatingInputPropertiesBuilderMobile = require('./RatingInputPropertiesBuilderMobile').RatingInputPropertiesBuilderMobile;
var RecordingInputPropertiesBuilderMobile = require('./RecordingInputPropertiesBuilderMobile').RecordingInputPropertiesBuilderMobile;
var NodeItemType = require('../../Core/Enums').NodeItemType;

var NodeItemPropertiesBuilderFactory = (function () {
    var NodeItemPropertiesBuilderFactory = function () {
    }

    NodeItemPropertiesBuilderFactory.Create = function (type) {
        switch (type) {
            case NodeItemType.TextPrompt:
                return new TextPromptPropertiesBuilderMobile();
            case NodeItemType.AudioPrompt:
                return new AudioPromptPropertiesBuilderMobile();
            case NodeItemType.RatingInput:
                return new RatingInputPropertiesBuilderMobile();
            case NodeItemType.RecordingInput:
                return new RecordingInputPropertiesBuilderMobile();
            default:
                throw Error("Node item type not supported");
        }
    };
    
    return NodeItemPropertiesBuilderFactory;
})();
exports.NodeItemPropertiesBuilderFactory = NodeItemPropertiesBuilderFactory;
var _ = require('underscore');
var AudioPromptPropertiesCompiler = require('../../Compiler/NodeItemPropertiesCompilers/AudioPromptPropertiesCompiler').AudioPromptPropertiesCompiler;

var AudioPromptPropertiesBuilderMobile = (function () {
    var AudioPromptPropertiesBuilderMobile = function () {
    }

    AudioPromptPropertiesBuilderMobile.prototype.BuildJson = function (properties, compileContext) {
        var compiler = new AudioPromptPropertiesCompiler(compileContext);
        var compiledProperties = compiler.Compile(properties);

        json = {};
        json['Delay'] = compiledProperties.Delay;
        json['PictureUrl'] = compiledProperties.PictureUrl;
        json['HeaderText'] = compiledProperties.HeaderText;
        json['Name'] = compiledProperties.Name;
        json['AudioUrl'] = compiledProperties.AudioUrl;
        return json;
    }
    return AudioPromptPropertiesBuilderMobile;
})();

exports.AudioPromptPropertiesBuilderMobile = AudioPromptPropertiesBuilderMobile;
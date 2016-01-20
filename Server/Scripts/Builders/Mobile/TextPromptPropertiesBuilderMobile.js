var _ = require('underscore');
var TextPromptPropertiesCompiler = require('../../Compiler/NodeItemPropertiesCompilers/TextPromptPropertiesCompiler').TextPromptPropertiesCompiler;

var TextPromptPropertiesBuilderMobile = (function () {
    var TextPromptPropertiesBuilderMobile = function () {
    }
    TextPromptPropertiesBuilderMobile.prototype.BuildJson = function (properties, compileContext) {
        var compiler = new TextPromptPropertiesCompiler(compileContext);
        var compiledProperties = compiler.Compile(properties);

        json = {};
        json['Delay'] = compiledProperties.Delay;
        json['PictureUrl'] = compiledProperties.PictureUrl;
        json['Text'] = compiledProperties.Text;
        json['Name'] = compiledProperties.Name;
        return json;
    }
    return TextPromptPropertiesBuilderMobile;
})();
exports.TextPromptPropertiesBuilderMobile = TextPromptPropertiesBuilderMobile;
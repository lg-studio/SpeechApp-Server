var DynamicContentCompiler = require('../DynamicContentCompiler').DynamicContentCompiler;

var TextPromptPropertiesCompiler = (function () {
    var TextPromptPropertiesCompiler = function (compileContext) {
        this.compiler = new DynamicContentCompiler(compileContext);
    }
    
    TextPromptPropertiesCompiler.prototype.Compile = function (niPropertiesModel) {
        var textPromptProperties = {}
        textPromptProperties.Delay = niPropertiesModel.Delay;
        textPromptProperties.PictureUrl = this.compiler.Compile(niPropertiesModel.PictureUrl);
        textPromptProperties.Text = this.compiler.Compile(niPropertiesModel.Text);
        textPromptProperties.Name = this.compiler.Compile(niPropertiesModel.Name);
        return textPromptProperties;
    }
    
    return TextPromptPropertiesCompiler;
})();

exports.TextPromptPropertiesCompiler = TextPromptPropertiesCompiler;
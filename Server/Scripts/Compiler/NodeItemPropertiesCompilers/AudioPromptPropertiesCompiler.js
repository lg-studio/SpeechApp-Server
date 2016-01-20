var DynamicContentCompiler = require('../DynamicContentCompiler').DynamicContentCompiler;

var AudioPromptPropertiesCompiler = (function () {
    var AudioPromptPropertiesCompiler = function (compileContext) {
        this.compiler = new DynamicContentCompiler(compileContext);
    }
    
    AudioPromptPropertiesCompiler.prototype.Compile = function (niPropertiesModel) {
        var audioPromptProperties = {};
        audioPromptProperties.Delay = niPropertiesModel.Delay;
        audioPromptProperties.PictureUrl = this.compiler.Compile(niPropertiesModel.PictureUrl);
        audioPromptProperties.HeaderText = this.compiler.Compile(niPropertiesModel.HeaderText);
        audioPromptProperties.Name = this.compiler.Compile(niPropertiesModel.Name);
        audioPromptProperties.AudioUrl = this.compiler.Compile(niPropertiesModel.AudioUrl)
        return audioPromptProperties;
    }
    
    return AudioPromptPropertiesCompiler;
})();

exports.AudioPromptPropertiesCompiler = AudioPromptPropertiesCompiler;

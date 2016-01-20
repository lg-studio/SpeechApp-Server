var assert = require("assert")
var _ = require('underscore');

var DynamicContentEntryCompiler = require('../Scripts/Compiler/DynamicContentEntryCompiler').DynamicContentEntryCompiler;
var DynamicContentCompiler = require('../Scripts/Compiler/DynamicContentCompiler').DynamicContentCompiler;

var CompileContext = require('../Scripts/Compiler/Models/CompileContext').CompileContext;
var UserCompileContext = require('../Scripts/Compiler/Models/UserCompileContext').UserCompileContext;
var RecordingCompileContext = require('../Scripts/Compiler/Models/RecordingCompileContext').RecordingCompileContext;

TextPromptPropertiesCompiler = require('../Scripts/Compiler/NodeItemPropertiesCompilers/TextPromptPropertiesCompiler').TextPromptPropertiesCompiler;
AudioPromptPropertiesCompiler = require('../Scripts/Compiler/NodeItemPropertiesCompilers/AudioPromptPropertiesCompiler').AudioPromptPropertiesCompiler;
MetricPropertiesCompiler = require('../Scripts/Compiler/NodeItemPropertiesCompilers/MetricPropertiesCompiler').MetricPropertiesCompiler;

var MetricCategoryType = require('../Scripts/Core/Enums').MetricCategoryType;

var context = new CompileContext();
context.Boot = new UserCompileContext("Boot-Catalin", "pictureCatalin.png");
context.Ratee = new UserCompileContext("Ratee-Ionut", "pictureIonut.png");
context.Player = new UserCompileContext("Player-Dragos", "pictureDragos.png");
context.Recording = new RecordingCompileContext("http://46.2.2.2.2/recordingA");

describe('TextPromptPropertiesCompiler', function () {
    it('should compile the dynamic content of the textPrompt', function () {

        var inputTxtPromptProp = {};
        inputTxtPromptProp.Delay = 1;
        inputTxtPromptProp.PictureUrl = "<%BOOT.PICTUREURL%>";
        inputTxtPromptProp.Text = "<%PLAYER.NAME%> Please describe...";
        inputTxtPromptProp.Name = "<%BOOT.NAME%>";

        var expectedTxtPromptProp = {};
        expectedTxtPromptProp.Delay = 1;
        expectedTxtPromptProp.PictureUrl = context.Boot.PictureUrl;
        expectedTxtPromptProp.Text = context.Player.Name + " Please describe...";
        expectedTxtPromptProp.Name = context.Boot.Name;

        var compiler = new TextPromptPropertiesCompiler(context);
        var compiledPrompt = compiler.Compile(inputTxtPromptProp);

        assert.equal(compiledPrompt.Delay, expectedTxtPromptProp.Delay);
        assert.equal(compiledPrompt.PictureUrl, expectedTxtPromptProp.PictureUrl);
        assert.equal(compiledPrompt.Text, expectedTxtPromptProp.Text);
        assert.equal(compiledPrompt.Name, expectedTxtPromptProp.Name);
    });
});

describe('AudioPromptPropertiesCompiler', function () {
    it('should compile the dynamic content of the audioPrompt', function () {
        var inputAudioPromptProp = {};
        inputAudioPromptProp.Delay = 1;
        inputAudioPromptProp.PictureUrl = "<%BOOT.PICTUREURL%>";
        inputAudioPromptProp.HeaderText = "<%PLAYER.NAME%> Please describe...";
        inputAudioPromptProp.Name = "<%BOOT.NAME%>";
        inputAudioPromptProp.AudioUrl = "http://2.2.2.2/staticAudio";

        var expectedAudioPromptProp = {};
        expectedAudioPromptProp.Delay = 1;
        expectedAudioPromptProp.PictureUrl = context.Boot.PictureUrl;
        expectedAudioPromptProp.HeaderText = context.Player.Name + " Please describe...";
        expectedAudioPromptProp.Name = context.Boot.Name;
        expectedAudioPromptProp.AudioUrl = "http://2.2.2.2/staticAudio";

        var compiler = new AudioPromptPropertiesCompiler(context);
        var compiledPrompt = compiler.Compile(inputAudioPromptProp);
        
        assert.equal(compiledPrompt.Delay, expectedAudioPromptProp.Delay);
        assert.equal(compiledPrompt.PictureUrl, expectedAudioPromptProp.PictureUrl);
        assert.equal(compiledPrompt.HeaderText, expectedAudioPromptProp.HeaderText);
        assert.equal(compiledPrompt.Name, expectedAudioPromptProp.Name);
        assert.equal(compiledPrompt.AudioUrl, expectedAudioPromptProp.AudioUrl);
    });
});

describe('MetricPropertiesCompiler', function () {
    it('should compile the dynamic content of the metric properties', function () {
        var inputMetricProperties = {};
        inputMetricProperties.Text = "How well did <%RATEE.NAME%> in describing the picture?"
        inputMetricProperties.Category = MetricCategoryType.Accuracy;

        var expectedMetricProperties = {};
        expectedMetricProperties.Text = "How well did " + context.Ratee.Name + " in describing the picture?";
        expectedMetricProperties.Category = MetricCategoryType.Accuracy;

        var compiler = new MetricPropertiesCompiler(context);
        var compiledMetric = compiler.Compile(inputMetricProperties);

        assert.equal(compiledMetric.Text, expectedMetricProperties.Text);
        assert.equal(compiledMetric.Category, expectedMetricProperties.Category);
    });
});
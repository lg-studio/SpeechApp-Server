var assert = require("assert")
var _ = require('underscore');
var DynamicContentEntryCompiler = require('../Scripts/Compiler/DynamicContentEntryCompiler').DynamicContentEntryCompiler;
var DynamicContentCompiler = require('../Scripts/Compiler/DynamicContentCompiler').DynamicContentCompiler;

var CompileContext = require('../Scripts/Compiler/Models/CompileContext').CompileContext;
var UserCompileContext = require('../Scripts/Compiler/Models/UserCompileContext').UserCompileContext;
var RecordingCompileContext = require('../Scripts/Compiler/Models/RecordingCompileContext').RecordingCompileContext;

describe('DynamicContentEntryCompiler', function () {
    it('should compile properly the input', function () {
        var context = new CompileContext();
        context.Boot = new UserCompileContext("Boot-Catalin", "pictureCatalin.png");
        context.Ratee = new UserCompileContext("Ratee-Ionut", "pictureIonut.png");
        context.Player = new UserCompileContext("Player-Dragos", "pictureDragos.png");
        context.Recording = new RecordingCompileContext("http://46.2.2.2.2/recordingA");

        var DCList =
            [
            { input: "<%BOOT.NAME%>", expected: context.Boot.Name },
            { input: "<%BOOT.PICTUREURL%>", expected: context.Boot.PictureUrl },
            { input: "<%RATEE.NAME%>", expected: context.Ratee.Name },
            { input: "<%RATEE.PICTUREURL%>", expected: context.Ratee.PictureUrl },
            { input: "<%PLAYER.NAME%>", expected: context.Player.Name },
            { input: "<%PLAYER.PICTUREURL%>", expected: context.Player.PictureUrl },
            { input: "<%RECORDING.AUDIOURL%>", expected: context.Recording.AudioUrl },
            { input: "<%RECORDINGZAD.AUDIOURL%>", expected: "<%RECORDINGZAD.AUDIOURL%>" },
            { input: "<%RECORDING.AUDIOURLsdsadsadas%>", expected: "<%RECORDING.AUDIOURLsdsadsadas%>" },
            ];
            
        var resolver = new DynamicContentEntryCompiler(context);
            
        _.each(DCList, function (testData) {
            var content = resolver.Resolve(testData.input);
            assert.equal(content, testData.expected);
        });
    });
});

describe('DynamicContentCompiler', function () {
    it('it should compile properly the content', function () {
        var context = new CompileContext();
        context.Boot = new UserCompileContext("Boot-Catalin", "pictureCatalin.png");
        context.Ratee = new UserCompileContext("Ratee-Ionut", "pictureIonut.png");
        context.Player = new UserCompileContext("Player-Dragos", "pictureDragos.png");
        context.Recording = new RecordingCompileContext("http://46.2.2.2.2/recordingA");

        var inputContent = "<%BOOT.NAME%> aaaa <%BOOT.PICTUREURL%> \n <%BOOT.NAME%> bb <%RECORDING.AUDIOURLsdsadsadas%> bb<%RECORDING.AUDIOURL%>";
        var compiler = new DynamicContentCompiler(context);
        var expectedContent = context.Boot.Name + " aaaa " + context.Boot.PictureUrl + " \n " + context.Boot.Name + " bb <%RECORDING.AUDIOURLsdsadsadas%> bb" + context.Recording.AudioUrl;
        var compiledContent = compiler.Compile(inputContent);
        assert.equal(compiledContent, expectedContent);
    });
});

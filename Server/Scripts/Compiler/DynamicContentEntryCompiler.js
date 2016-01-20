var UserEntryDynamicContentResolver = require('./UserEntryDynamicContentResolver').UserEntryDynamicContentResolver;
var RecordingEntryDynamicContentResolver = require('./RecordingEntryDynamicContentResolver').RecordingEntryDynamicContentResolver;
var DynamicContentEntityType = require('../Core/Enums').DynamicContentEntityType;

var DynamicContentEntryCompiler = (function () {
    var DynamicContentEntryCompiler = function (compileContext) {
        this.compileContext = compileContext;
    }
    
    DynamicContentEntryCompiler.prototype.Resolve = function (dynamicContentEntry) {
        var tokens = dynamicContentEntry.substr(2, dynamicContentEntry.length - 4).split(".");
        var entityType = tokens[0];
        var fieldType = tokens[1];
        
        var value = null;
        switch (entityType) {
            case DynamicContentEntityType.Boot:
                if (this.compileContext.Boot == null) {
                    break;
                }
                var resolver = new UserEntryDynamicContentResolver(this.compileContext.Boot);
                value = resolver.Resolve(fieldType);
                break;
            case DynamicContentEntityType.Ratee:
                if (this.compileContext.Ratee == null) {
                    break;
                }
                var resolver = new UserEntryDynamicContentResolver(this.compileContext.Ratee);
                value = resolver.Resolve(fieldType);
                break;
            case DynamicContentEntityType.Player:
                if (this.compileContext.Player == null) {
                    break;
                }
                var resolver = new UserEntryDynamicContentResolver(this.compileContext.Player);
                value = resolver.Resolve(fieldType);
                break;
            case DynamicContentEntityType.Recording:
            //TODO: Test change
                if (this.compileContext.RecordingCollection == null) {
                    break;
                }
                var resolver = new RecordingEntryDynamicContentResolver(this.compileContext.RecordingCollection.GetNextRecording());
                value = resolver.Resolve(fieldType);
                break;
            default:
                value = null;
        }
        return value || dynamicContentEntry;
    }
    return DynamicContentEntryCompiler;
})();

exports.DynamicContentEntryCompiler = DynamicContentEntryCompiler;
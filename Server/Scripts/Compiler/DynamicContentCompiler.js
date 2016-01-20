var DynamicContentEntryCompiler = require('./DynamicContentEntryCompiler').DynamicContentEntryCompiler;
var _ = require('underscore');

var DynamicContentCompiler = (function () {
    var DynamicContentCompiler = function (compileContext) {
        this.compileContext = compileContext;
    }
    
    DynamicContentCompiler.prototype.Compile = function (content) {
        var dcRegex = /<%.+?%>/g;
        var dcEntryList = content.match(dcRegex);
        var dceCompiler = new DynamicContentEntryCompiler(this.compileContext);
        var compiledContent = content;
        _.forEach(dcEntryList, function (dcEntry) {
            var value = dceCompiler.Resolve(dcEntry);
            compiledContent = compiledContent.replace(dcEntry, value);
        });
        return compiledContent;
    }
    return DynamicContentCompiler;
})();

exports.DynamicContentCompiler = DynamicContentCompiler;
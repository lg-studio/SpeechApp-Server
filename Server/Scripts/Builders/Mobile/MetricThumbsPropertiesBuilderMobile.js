var _ = require('underscore');
var MetricPropertiesCompiler = require('../../Compiler/NodeItemPropertiesCompilers/MetricPropertiesCompiler').MetricPropertiesCompiler;
var DynamicContentCompiler = require('../../Compiler/DynamicContentCompiler').DynamicContentCompiler;

var MetricThumbsPropertiesBuilderMobile = (function () {
    var MetricThumbsPropertiesBuilderMobile = function () {
    }
    MetricThumbsPropertiesBuilderMobile.prototype.BuildJson = function (metric, compileContext) {
        var compiler = new MetricPropertiesCompiler(compileContext);
        var compiledProperties = compiler.Compile(metric.Properties);
        var json = {
            Id: metric.Id,
            Type: metric.Type,
            Properties : {
                Text: compiledProperties.Text,
                Category: compiledProperties.Category,
            }
        };
        return json;
    }
    return MetricThumbsPropertiesBuilderMobile;
})();
exports.MetricThumbsPropertiesBuilderMobile = MetricThumbsPropertiesBuilderMobile;
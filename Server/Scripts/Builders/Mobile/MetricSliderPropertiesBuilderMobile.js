var _ = require('underscore');
var MetricPropertiesCompiler = require('../../Compiler/NodeItemPropertiesCompilers/MetricPropertiesCompiler').MetricPropertiesCompiler;
var DynamicContentCompiler = require('../../Compiler/DynamicContentCompiler').DynamicContentCompiler;

var MetricSliderPropertiesBuilderMobile = (function () {
    var MetricSliderPropertiesBuilderMobile = function () {
    }
    MetricSliderPropertiesBuilderMobile.prototype.BuildJson = function (metric, compileContext) {
        var compiler = new MetricPropertiesCompiler(compileContext);
        var compiledProperties = compiler.Compile(metric.Properties);
        var json = {
            Id: metric.Id,
            Type: metric.Type,
            Properties : {
                Text: compiledProperties.Text,
                Category: compiledProperties.Category,
                Labels: metric.Properties.Labels
            }
        };
        return json;
    }
    return MetricSliderPropertiesBuilderMobile;
})();
exports.MetricSliderPropertiesBuilderMobile = MetricSliderPropertiesBuilderMobile;
var DynamicContentCompiler = require('../DynamicContentCompiler').DynamicContentCompiler;

var MetricPropertiesCompiler = (function () {
    var MetricPropertiesCompiler = function (compileContext) {
        this.compiler = new DynamicContentCompiler(compileContext);
    }
    
    MetricPropertiesCompiler.prototype.Compile = function (metricPropertiesModel) {
        var metricProperties = {};
        metricProperties.Text = this.compiler.Compile(metricPropertiesModel.Text);
        metricProperties.Category = metricPropertiesModel.Category;
        return metricProperties;
    };
    return MetricPropertiesCompiler;
})();

exports.MetricPropertiesCompiler = MetricPropertiesCompiler;
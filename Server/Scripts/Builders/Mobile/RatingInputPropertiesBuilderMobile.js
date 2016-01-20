var _ = require('underscore');
var MetricPropertiesCompiler = require('../../Compiler/NodeItemPropertiesCompilers/MetricPropertiesCompiler').MetricPropertiesCompiler;
var DynamicContentCompiler = require('../../Compiler/DynamicContentCompiler').DynamicContentCompiler;
var MetricPropertiesBuilderFactory = require('./MetricPropertiesBuilderFactory').MetricPropertiesBuilderFactory;

var RatingInputPropertiesBuilderMobile = (function () {
    var RatingInputPropertiesBuilderMobile = function () {
    }
    RatingInputPropertiesBuilderMobile.prototype.BuildJson = function (document, compileContext) {
        json = {};
        var fieldCompiler = new DynamicContentCompiler(compileContext);
        json['UserName'] = fieldCompiler.Compile(document.UserName);
        json['Metrics'] = [];
        
        _.forEach(document.Metrics, function (metric) {
            var metricBuilder = MetricPropertiesBuilderFactory.Create(metric.Type);
            var metricJson = metricBuilder.BuildJson(metric, compileContext);
            json['Metrics'].push(metricJson);
        });
        return json;
    }
    return RatingInputPropertiesBuilderMobile;
})();
exports.RatingInputPropertiesBuilderMobile = RatingInputPropertiesBuilderMobile;
var _ = require('underscore');
var MetricSliderPropertiesBuilderMobile = require('./MetricSliderPropertiesBuilderMobile').MetricSliderPropertiesBuilderMobile;
var MetricThumbsPropertiesBuilderMobile = require('./MetricThumbsPropertiesBuilderMobile').MetricThumbsPropertiesBuilderMobile;
var MetricType = require('../../Core/Enums').MetricType;

var MetricPropertiesBuilderFactory = (function () {
    var MetricPropertiesBuilderFactory = function () {
    }

    MetricPropertiesBuilderFactory.Create = function (type) {
        switch (type) {
            case MetricType.Slider:
                return new MetricSliderPropertiesBuilderMobile();
            case MetricType.Thumbs:
                return new MetricThumbsPropertiesBuilderMobile();
            default:
                throw Error("Metric type not supported");
        }
    };
    
    return MetricPropertiesBuilderFactory;
})();
exports.MetricPropertiesBuilderFactory = MetricPropertiesBuilderFactory;
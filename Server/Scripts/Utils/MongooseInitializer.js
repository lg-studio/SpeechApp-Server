function LoadModels() {
    var sep = require('path').sep;
    var fs = require('fs');
    var currentDir = __dirname;
    var baseDir = currentDir.substring(0, currentDir.indexOf(sep + 'Utils'));
    var modelsPath = baseDir + sep + "DAL" + sep;
    fs.readdirSync(modelsPath).forEach(function (file) {
        if (~file.indexOf('.js')) {
            var fullPath = modelsPath + file;
            require(fullPath);
        }
    });
}

exports.LoadModels = LoadModels;
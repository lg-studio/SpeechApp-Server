var DynamicContentUserFieldType = require('../Core/Enums').DynamicContentUserFieldType;

var UserEntryDynamicContentResolver = (function () {
    var UserEntryDynamicContentResolver = function (user) {
        this.user = user;
    }
    
    UserEntryDynamicContentResolver.prototype.Resolve = function (field) {
        var value = null;
        switch (field) {
            case DynamicContentUserFieldType.Name:
                value = this.user.Name;
                break;
            case DynamicContentUserFieldType.PictureUrl:
                value = this.user.PictureUrl;
                break;
            default:
                value = null;
        }
        return value;
    };
    
    return UserEntryDynamicContentResolver;
})();

exports.UserEntryDynamicContentResolver = UserEntryDynamicContentResolver;
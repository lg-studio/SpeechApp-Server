var UserCompileContext = (function () {
    function UserCompileContext(name, pictureUrl) {
        this._name = name;
        this._pictureUrl = pictureUrl;
    }
    Object.defineProperty(UserCompileContext.prototype, "Name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserCompileContext.prototype, "PictureUrl", {
        get: function () {
            return this._pictureUrl;
        },
        enumerable: true,
        configurable: true
    });
    return UserCompileContext;
})();

exports.UserCompileContext = UserCompileContext;
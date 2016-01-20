var ApplicationContext = (function () {
    function ApplicationContext(){
        this.connection = null;
    }
    ApplicationContext.prototype.GetConnection = function (){
        return this.connection;
    }
    ApplicationContext.prototype.SetConnection = function (value) {
        this.connection = value;
    }

    return ApplicationContext;
})();

exports.ApplicationContext = ApplicationContext;
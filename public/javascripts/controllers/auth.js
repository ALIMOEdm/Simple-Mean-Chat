chat.controller('registrationCtrl', ['userFactory', '$rootScope', function(userFactory, $rootScope){
    this.user = {};

    this.register = function(){
        userFactory.register(this.user);
    };

    var self = this;

    $rootScope.$on('registerfailed', function(data){
        self.register_error = true;
        self.register_error_message = userFactory.getErrorMessage();
    });

    $rootScope.$on('loggedin', function(){
        this.register_error = false;
    });

}]);

chat.controller('loginCtrl', ['userFactory', '$rootScope', function(userFactory, $rootScope){
    this.user = {};

    this.login = function(){
        userFactory.login(this.user);
    };

    var self = this;
    $rootScope.$on('loginfaailed', function(){
        self.login_error = true;
        self.login_error_message = userFactory.getErrorMessage();
    });
    $rootScope.$on('loggedin', function(){
        this.login_error = false;
    });
}]);

chat.controller('activateCtrl', ['userFactory', '$rootScope', function(userFactory, $rootScope){
    this.user = {};

    this.activate = function(){
        userFactory.activateUser(this.activate_code);
    };

    this.resendEmail = function(){
        userFactory.resendActivateEmail();
    };

    var self = this;
    $rootScope.$on('loginfaailed', function(){
        self.login_error = true;
        self.login_error_message = userFactory.getErrorMessage();
    });
    $rootScope.$on('loggedin', function(){
        this.login_error = false;
    });
}]);
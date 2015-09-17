chat.factory('userFactory', ['$rootScope', '$http', '$cookies', '$location', '$state', '$timeout', '$q',
    function($rootScope, $http, $cookies, $location, $state, $timeout, $q){
    function escape(html) {
        return String(html)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    var self;

    function b64_to_utf8( str ) {
        //console.log(escape(window.atob( str )));
        //console.log(decodeURIComponent(escape(window.atob( str ))));
        return decodeURIComponent(window.atob( str ));
    }

    function ChatUser(){
        this.name = '';
        this.user = {};
        this.loggedin = false;
        this.isAdmin = false;
        this.loginError = 0;
        this.nameError = null;
        this.registerError = null;
        this.validationError = null;
        self = this;


        $http.get('/auth/user/me').success(function(response){
            if(!response && $cookies.get('token') && $cookies.get('redirect')){
                self.onIdentity.bind(self)({
                    token: $cookies.get('token'),
                    redirect: $cookies.get('redirect').replace(/^"|"$/g, '')
                });
                $cookies.remove('token');
                $cookies.remove('redirect');
            }else{
                self.onIdentity.bind(self)(response)
            }
        });
    }

    ChatUser.prototype.getEmail = function(){
        if(this.user) {
            return this.user.email;
        }
        return '';
    };

    ChatUser.prototype.onIdentity = function(response){
        if(!response){
            return;
        }

        var encodedUser, user, destination;
        if(angular.isDefined(response.token)){
            localStorage.setItem('JWT', response.token);
            encodedUser = decodeURI(b64_to_utf8(response.token.split('.')[1]));
            console.log(encodedUser);
            user = JSON.parse(encodedUser);
        }

        destination = angular.isDefined(response.redirect) ? response.redirect : destination;
        this.user = user || response;
        this.loggedin = true;
        this.loginError = 0;
        this.registerError = 0;
        this.isAdmin = this.user.roles ? !! (this.user.roles.indexOf('admin') + 1) : 0;
        if(!user.activate){
            $location.path($state.href('auth.activate').replace(/[#]/ig, ''));
        }
        if (destination) $location.path(destination);
        $rootScope.$emit('loggedin');
    };

    ChatUser.prototype.onIdFail = function(response){
        if(response && response.redirect){
            $location.path(response.redirect);
        }
        if(response && response.redirect_reject){
            $location.path(response.redirect_reject);
        }
        this.loginError = 'Authentification failed.';
        this.registerError = response;
        this.validationError = response.msg ? (response.msg) : (response[0].msg ? response[0].msg : 'Unknow error');
        //console.log(111);
        $rootScope.$emit('loginfaailed');
        $rootScope.$emit('registerfailed');
    };

    ChatUser.prototype.getErrorMessage = function(){
        return this.validationError;
    };

    var chatUser = new ChatUser();

    ChatUser.prototype.register = function(user){
        $http.post('/auth/user/register', {
            email: user.email,
            name: user.name,
            password: user.password,
            confirmPassword: user.confirmPassword,
            redirect: $state.href('mainChatPage').replace(/[#]/ig, '')
        })
            .success(this.onIdentity.bind(this))
            .error(this.onIdFail.bind(this));
    };

    ChatUser.prototype.login = function(user){
        $http.post('/auth/user/login', {
            email: user.email,
            password: user.password,
            redirect: $state.href('mainChatPage').replace(/[#]/ig, '')
        })
            .success(this.onIdentity.bind(this))
            .error(this.onIdFail.bind(this));
    };

    ChatUser.prototype.logOut = function(){
        this.user = {};
        this.isAdmin = false;
        this.loggedin = false;

        $http.get('/auth/user/logout').success(function(){
            localStorage.removeItem('JWT');
            $rootScope.$emit('logout');
            $location.path($state.href('auth.login').replace(/[#]/ig, ''));
        });
    };

    ChatUser.prototype.checkLoggedOut = function(){
        var defer = $q.defer();

        $http.get('/auth/user/loggedin').success(function(user){
            if(user){
                $timeout(defer.reject);
            }
            else{
                $timeout(defer.resolve);
            }
        });

        return defer.promise;
    };

    ChatUser.prototype.checkLoggedIn = function(){
        var defer = $q.defer();

        console.log('checkLoggedIn');
        $http.get('/auth/user/loggedin').success(function(user){
            if(user){
                $timeout(defer.resolve);
                if(!user.activate){
                    $location.path($state.href('auth.activate').replace(/[#]/ig, ''));
                }else{
                    $rootScope.$emit('loginned');
                }
            }else{
                $cookies.put('redirect', $location.path());
                $timeout(defer.reject);
                $location.path($state.href('auth.login').replace(/[#]/ig, ''));
            }
        });


        return defer.promise;
    };

    ChatUser.prototype.activateUser = function(activate_code){
        $http.post('/auth/user/activate', {
            conf_str: activate_code,
            redirect: $state.href('mainChatPage').replace(/[#]/ig, ''),
            redirect_reject: $state.href('auth.login').replace(/[#]/ig, '')
        })
            .success(this.onIdentity.bind(this))
            .error(this.onIdFail.bind(this))
        ;
    };

    ChatUser.prototype.resendActivateEmail = function(){
        $http.post('/auth/user/resendactivateemail', {
            redirect_reject: $state.href('auth.login').replace(/[#]/ig, '')
        })
            .success(this.onIdentity.bind(this))
            .error(this.onIdFail.bind(this))
        ;
    };

    return chatUser;
}]);

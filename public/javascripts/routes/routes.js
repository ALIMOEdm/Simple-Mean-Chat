chat.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    //$urlRouterProvider.otherwise('/');

    //$locationProvider.hashPrefix('#');

    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: '/views/landing.html'
        })
        .state('mainChatPage', {
            url: '/chat',
            templateUrl: '/views/mainchatPage.html',
            resolve: {
                //loggedin: function(userFactory){
                //    return userFactory.checkLoggedIn();
                //},
                roomPromise: [
                    'rooms',
                    'userFactory',
                    function(rooms, userFactory){
                        console.log(userFactory);
                        userFactory.checkLoggedIn().then(function(){
                            return rooms.getAll();
                        });
                    }
                ]

            }
        })
        .state('auth', {
            url: '/auth',
            templateUrl: '/views/auth/authMain.html'
        })
        .state('auth.registration', {
            url: '/registration',
            templateUrl: '/views/auth/registerPage.html',
            parent: 'auth'
        })
        .state('auth.login', {
            url: '/login',
            templateUrl: '/views/auth/loginPage.html',
            parent: 'auth'
        })
        .state('auth.activate', {
            url: '/activate',
            templateUrl: '/views/auth/activatePage.html',
            parent: 'auth'
        })
    ;
});
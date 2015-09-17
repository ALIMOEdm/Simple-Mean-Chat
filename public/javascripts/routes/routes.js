chat.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    //$urlRouterProvider.otherwise('/');

    //$locationProvider.hashPrefix('#');

    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: '/views/landing.html'
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
                    //rooms, userFactory
                    function(rooms, userFactory){
                        userFactory.checkLoggedIn().then(function(){
                            return rooms.getAll();
                        });
                    }
                ]
            }
        })
        .state('mainChatPage.chatRoom', {
            url: '/:roomId',
            templateUrl: '/views/roomPage.html',
            parent: 'mainChatPage',
            resolve: {
                room: [
                    '$stateParams',
                    'chatFactory',
                    'rooms',
                    function($stateParams, chatFactory, rooms){
                        var room_id = $stateParams.roomId;
                        rooms.setActiveRoom(room_id);
                        chatFactory.addRoom(room_id);
                    }
                ],
                messages: [
                    '$stateParams',
                    'chatMessageFactory',
                    function($stateParams, chatMessageFactory){
                        var room_id = $stateParams.roomId;
                        return chatMessageFactory.getRoomMessages(room_id);
                    }
                ],
                roomPromise: [
                    'rooms',
                    'userFactory',
                    function(rooms, userFactory){
                        return rooms.getAll();
                    }
                ]
            }
        })
    ;
});
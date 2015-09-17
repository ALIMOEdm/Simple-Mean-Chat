chat.factory('chatFactory', ['$rootScope', '$http', '$cookies', '$location', '$state', '$timeout', '$q', 'userFactory','socketFactory',
    function($rootScope, $http, $cookies, $location, $state, $timeout, $q, userFactory, socketFactory){

        var socket = socketFactory;

        $rootScope.$on('loginned', function(){
            socket.emit('socketAuth', {
                user: {
                    email: userFactory.getEmail(),
                    test: '111'
                },
                rer: 11
            });
        });

        socket.on('socketAuth', function (data) {
            console.log(data);

        });

        //socket.on('sendMessage', function (data) {
        //    console.log('sendMessage', data);
        //
        //});

        var ob = {
        };

        ob.addRoom = function(room_id){
                console.log('comeToRoom');
                socket.emit('comeToRoom', {
                    room: room_id
                });
            };
        //ob.sendMessage = function(ob){
        //        console.log('sendMessage');
        //        socket.emit('sendMessage', {
        //            message_object: ob
        //        });
        //    };

        return ob;
}]);
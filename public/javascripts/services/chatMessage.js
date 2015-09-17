chat.factory('chatMessageFactory', ['$rootScope', '$http', '$cookies', '$location', '$state', '$timeout', '$q',
    'userFactory','socketFactory','rooms',
        function($rootScope, $http, $cookies, $location, $state, $timeout, $q, userFactory, socketFactory, rooms){
            var mess_object  = {
                messages: []
            };

            var socket = socketFactory;

            socket.on('sendMessage', function (data) {
                console.log('sendMessage', data.message);
                $rootScope.$apply(function () {
                    if(data.message && data.message.room.uniq == rooms.getActiveRoom())
                        mess_object.messages.push(data.message);
                });
            });

            mess_object.getRoomMessages = function(room_uniq){
                return $http.get('/chat/room/'+room_uniq+'/messages').success(function(data){
                    console.log(data);
                    angular.copy(data.messages, mess_object.messages);
                });
            };

            mess_object.sendMessage = function(ob){
                console.log('sendMessage');
                socket.emit('sendMessage', {
                    message_object: ob
                });
            };

            return mess_object;
        }
]);
var chat = angular.module('Chat', ['ui.router', 'ngCookies', 'ngSanitize']);

chat.controller('ChatController', ['rooms', 'chatFactory', '$state',
    function(rooms, chatFactory, $state){
        this.name = '';
        this.rooms = rooms.rooms;
        this.current_room = rooms.cur_room;
        var self = this;
        this.addRoom = function(){
            if(!self.name || self.name === ''){
                return;
            }

            var newRoom = {
                title : self.name
            };

            rooms.add(newRoom).then(function(){
                console.log('added');
                self.name = '';
                rooms.getAll();
            });
        };

        this.chooseRoom = function(event){
            var src = event.target;
            var room_identity = src.getAttribute('data-identity');
            $state.go('mainChatPage.chatRoom', {roomId: room_identity});
            this.current_room = rooms.cur_room;
        }
}]);
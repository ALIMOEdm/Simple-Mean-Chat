var chat = angular.module('Chat', ['ui.router', 'ngCookies']);

chat.controller('ChatController', ['rooms', function(rooms){
    this.name = '';
    this.rooms = rooms.rooms;
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
    }
}]);
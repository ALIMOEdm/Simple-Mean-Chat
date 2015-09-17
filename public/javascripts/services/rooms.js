chat.factory('rooms', ['$rootScope','$http', '$q', 'chatFactory',
    function($rootScope, $http, $q, chatFactory){
        var rooms = {
            rooms : [],
            cur_room: ''
        };

        rooms.add = function (room){
            var def = $q.defer();
            $http.post('/room', room)
                .success(function (data){
                    rooms.rooms.push(data);
                    chatFactory.addRoom(data._id);
                    def.resolve(data);
                })
                .error(function(){
                    def.reject();
                });
            return def.promise;
        };

        rooms.getAll = function(){
            $http.get('/room')
                .success(function(data){
                    angular.copy(data, rooms.rooms);
                })
        };

        rooms.setActiveRoom = function(room_id){
            rooms.cur_room = room_id;
        };
        rooms.getActiveRoom = function(){
            return rooms.cur_room;
        };


        return rooms;
}]);
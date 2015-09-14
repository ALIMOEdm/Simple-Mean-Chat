chat.factory('rooms', function($http, $q){
    var rooms = {
        rooms : []
    };

    rooms.add = function (room){
        var def = $q.defer();
        $http.post('/room', room)
            .success(function (data){
                rooms.rooms.push(data);
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

    return rooms;
});
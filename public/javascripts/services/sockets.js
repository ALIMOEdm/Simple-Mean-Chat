chat.factory('socketFactory', function(){
    var socket = io('http://localhost:3200');
    return socket;
});
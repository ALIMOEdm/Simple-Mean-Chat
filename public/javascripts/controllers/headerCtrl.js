chat.controller('headerCtrl', ['userFactory', function(userFactory){
    this.logout = function(){
        userFactory.logOut();
    }
}]);
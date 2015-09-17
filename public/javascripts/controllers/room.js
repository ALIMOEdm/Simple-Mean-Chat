chat.controller('roomCtrl', ['tools', '$scope', 'chatFactory', '$stateParams', 'userFactory',
    'chatMessageFactory', '$rootScope',
    function(tools, $scope, chatFactory, $stateParams, userFactory, chatMessageFactory, $rootScope){
        $scope.userMessage = '';
        $scope.messages = chatMessageFactory.messages;
        console.log($scope.messages);
        $scope.room_indent = $stateParams.roomId;

        $scope.chatMessageHandler = function(event){
            console.log(event);
            if(event.keyCode == 13 && !event.shiftKey){
                //send message
                event.preventDefault();
                $scope.sendMessage();
            }
            else if(event.keyCode == 13 && event.shiftKey){
                var html = '<div><br></div>';
                tools.insertHTML(html);
            }
        };

        $scope.sendMessage = function(){
            if(!$scope.userMessage){
                return;
            }
            var ob = {
                message: $scope.userMessage,
                room: $stateParams.roomId,
                email: userFactory.getEmail()
            };
            chatMessageFactory.sendMessage(ob);

            $scope.userMessage = '';
        };

        $rootScope.$on('newMessage', function(){
            $scope.messages = chatMessageFactory.messages;
        });
}]);

chat.directive('contenteditable', ['$sce', function($sce) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                scope.$evalAsync(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if ( attrs.stripBr && html == '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
}]);
'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/conversation/:id', {
    templateUrl: 'conversation/conversation.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$http', '$location','$routeParams','HostService', function($scope, $http, $location, $routeParams, HostService) {
    var token = localStorage.getItem('token');
    var receiverId =  $routeParams.id;
    var messages;
    function getMessage() {
      $http.get(HostService.api + "/coversation/"+receiverId)
      .then(function successCallBack(response){
          if(response.data.length == 0)
              $scope.isNone = true;
          else{
                messages = response.data.items;
                meregeMessage();
          }
      }, function errorCallBack(response){
          $scope.isNone = true;
          $scope.isError = true;
          $scope.errorMessage = 'Somethings wrong happened. Please try later'
      })
  }
    if(token == undefined)
        $location.path('/#/login').replace();
    else {
        $http.defaults.headers.common.Authorization = token;
        getMessage();
    }
    $scope.submitChat = function(input){
        console.log(input);
        console.log(self.typedMsg);
    }

    function meregeMessage(){
        $scope.$applyAsync(function(){
            $scope.allMessages = messages
        });
    }
}]);
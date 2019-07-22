angular.module('myApp.users', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl'
  });
}])

.controller('UsersCtrl', ['$scope','$location', '$http', 'HostService' ,function($scope, $location, $http, HostService) {
    var token = localStorage.getItem('token');
    
    var connection = new WebSocket("ws://localhost:3000/"+token);
    connection.onopen = function (e){
      connection.send('ping');
    };
    connection.addEventListener('message', function (m) { 
        console.log(m.data); 
    });

    connection.onerror = function(err){
      console.log("Socket Error ",err);
    }
    
    function setUserDetails() {
        $scope.isNone = false;
        $scope.isError = false;
        $scope.errorMessage = "";

        $http.get(HostService.api + "users")
        .then(function successCallBack(response){
            if(response.data.length == 0)
                $scope.isNone = true;
            else{
                $scope.isNone = false;
                $scope.users = response.data.items;
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
        setUserDetails();
    }
}]);
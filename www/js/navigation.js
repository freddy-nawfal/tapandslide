
var app = angular.module('main', ['ngRoute']);

app.controller('mainController', ['$scope', function($scope) {
    $scope.templates =
      [{ name: 'mainMenu', url: 'mainMenu.html'},
       { name: 'game.html', url: 'game.html'}];
    $scope.template = $scope.templates[0];


    $scope.play = function(){
    	$scope.template = $scope.templates[1];
    	launch();
    }

    $scope.menu = function(){
      console.log("wsh");
      $scope.template = $scope.templates[0];
    }
}]);

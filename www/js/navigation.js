
var app = angular.module('main', ['ngRoute']);

app.controller('mainController', ['$scope', function($scope) {
    $scope.templates =
      [{ name: 'mainMenu', url: 'mainMenu.html'},
       { name: 'game.html', url: 'game.html'}];
    $scope.template = $scope.templates[0];


    $scope.play = function(){
    	console.log("clicked");
    	$scope.template = $scope.templates[1];
    	launch();
    }
}]);


/*(function(angular) {
  'use strict';
angular.module('main', ['ngRoute', 'ngAnimate'])
  .controller('mainController', ['$scope', function($scope) {
    $scope.templates =
      [{ name: 'mainMenu', url: 'mainMenu.html'},
       { name: 'game.html', url: 'game.html'}];
    $scope.template = $scope.templates[0];
  }]);
})(window.angular);*/
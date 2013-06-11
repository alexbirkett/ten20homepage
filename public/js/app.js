'use strict';


// Declare app level module which depends on filters, and services
angular.module('ten20', ['ten20.filters', 'ten20.services', 'ten20.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
  }]);


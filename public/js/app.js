'use strict';


// Declare app level module which depends on filters, and services
angular.module('ten20', ['ten20.filters', 'ten20.services', 'ten20.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
  }]);


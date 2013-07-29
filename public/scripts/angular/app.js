'use strict';

// Declare app level module which depends on filters, and services
angular.module('ten20Angular', [
  'ten20Angular.controllers',
  'ten20Angular.filters',
  'ten20Angular.services',
  'ten20Angular.directives',
  'ngGrid',
  'btford.socket-io'
]);
/*.
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/admin', {
      //templateUrl: 'partials/partial1',
      controller: 'ContactUserCtrl'
    }).
    when('/user', {
      //templateUrl: 'partials/partial2',
      controller: 'SocketCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
}); */

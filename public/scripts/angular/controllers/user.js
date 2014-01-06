'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', function ($scope, $http, socket) {
  // init user and trackers information
  $scope.user = {};
  $scope.trackers = [];

  $http.get('/user/info').success(function(userinfo) {
    $scope.user = userinfo;
  });

  $http.get('/trackers').success(function(data) {
    $scope.trackers = data.items;
    $scope.$broadcast('InitMap');
  });

  $http.get('/recent_messages').success(function(data) {
    //TODO
  });

  $http.get('/trips').success(function(data) {
    //TODO
  });
});



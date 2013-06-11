'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/data/model.json'}).
  success(function(data, status, headers, config) {
    $scope.data = data;
  }).
  error(function(data, status, headers, config) {
    $scope.data = 'Error!'
  });
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

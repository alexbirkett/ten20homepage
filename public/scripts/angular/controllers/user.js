'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', function ($scope, $http) {
  // init user and trackers information
  $scope.user = {};
  $scope.trackers = [];

  // get user account info
  $http.get('/user/info').success(function(userinfo) {
    $scope.user = userinfo;
  });
  // get trackers info
  $http.get('/trackers').success(function(data) {
    $scope.trackers = data.items;
    $scope.$broadcast('InitMap');
  });

  // refresh tracker
  $scope.refreshTracker = function(t) {
    $scope.activeTracker = t;
    $scope.$broadcast('FocusTracker', t);
    $scope.loadRecentMsg(t);
    $scope.loadTrip(t);
  };

  // load recent msg of a tracker
  $scope.loadRecentMsg = function(t) {
    $http.get('/recent_messages?trackerId=' + t._id).success(function(data) {
      console.log('------recent_message-----');
      t.recent = t.recent || {};
      t.recent.msgs = _filterValidMsg(data.items);
      console.log(t.recent.msgs);
      $scope.$broadcast('RecentUpdate', t);
    });
  }
  
  // load trips of at tracker
  $scope.loadTrip = function(t) {
    $http.get('/trips?trackerId=' + t._id).success(function(data) {
      console.log('------trips-----');
      t.trip = t.trip || {};
      t.trip.msgs = _filterValidMsg(data.items);
      console.log(t.trip.msgs);
      $scope.$broadcast('TripUpdate', t);
    });
  }

  function _filterValidMsg(data) {
    var validMsg = [];

    // filter out useless messages
    for (var i = 0; i < data.length; i++) {
      if (data[i].message && data[i].message.location) {
        validMsg.push(data[i].message);
      }
    }

    return validMsg;
  }

});



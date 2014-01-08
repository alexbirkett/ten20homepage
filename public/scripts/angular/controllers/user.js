'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', function ($scope, $http, socket) {
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
    $scope.$broadcast('FocusTracker', t);
    $scope.loadRecentMsg(t);
    $scope.loadTrip(t);
  };

  // load recent msg of a tracker
  $scope.loadRecentMsg = function(t) {
    $http.get('/recent_messages?trackerId=' + t.trackerId).success(function(data) {
      console.log('------recent_message-----');
      console.log(data);
      t.recent.msgs = _filterMessage(data);
      console.log(t.recentMsg);
      $scope.$broadcast('RecentUpdate', t);
    });
  }
  
  // load trips of at tracker
  $scope.loadTrip = function(t) {
    $http.get('/trips?trackerId=' + t.trackerId).success(function(data) {
      console.log('------trips-----');
      console.log(data);
      t.trip.msgs = data;
      $scope.$broadcast('TripUpdate', t);
    });
  }

  // filter out useless messages, condition:
  // Two point distance greater than 400m
  function _filterMessage(m) {
    var validMsg = [];

    for (var i = 0; i < m.length; i++) {
      if (m[i].message.location) {
        if (validMsg.length !== 0) {
          if (_compareDist(m[i].message, validMsg[validMsg.length - 1])) {
            valideMsg.push(m[i].message);
          }
        } else {
          validMsg.push(m[i].message);
        }
      }
    };
    
  }
  // compare two message distance
  function _compareDist(msg1, msg2) {

    var dist = _getDistanceFromLatLonInKm(
          msg1.location.latitude, msg1.location.longitude,
          msg2.location.latitude, msg2.location.longitude
        );

    if (dist > 0.4) {
      return true;
    } 

    return false;
  }

  // calculate two point circle distance on earth
  function _getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  // degree to radius
  function _deg2rad(deg) {
    return deg * (Math.PI/180)
  }

});



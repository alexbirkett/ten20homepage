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
    $scope.$broadcast('FocusTracker', t);
    $scope.loadRecentMsg(t);
    $scope.loadTrip(t);
  };

  // load recent msg of a tracker
  $scope.loadRecentMsg = function(t) {
    $http.get('/recent_messages?trackerId=' + t._id).success(function(data) {
      console.log('------recent_message-----');
      // REMOVE LATER
      t.recent = t.recent || {};
      t.recent.msgs = _filterMessage(_stubDataforTesing(data.items));
      console.log(t.recent.msgs);
      $scope.$broadcast('RecentUpdate', t);
    });
  }
  
  // load trips of at tracker
  $scope.loadTrip = function(t) {
    $http.get('/trips?trackerId=' + t._id).success(function(data) {
      console.log('------trips-----');
      console.log(data);
      t.trip = t.trip || {};
      t.trip.msgs = data;
      $scope.$broadcast('TripUpdate', t);
    });
  }

  //TODO: remove later
  function _stubDataforTesing(data) {
    var l;
    var validMsg = [];
    var mockL;

    // filter out useless messages
    for (var i = 0; i < data.length; i++) {
      if (data[i].message && data[i].message.location) {
        validMsg.push(data[i]);
      }
    };

    l = validMsg.length;

    if (l === 0) {
      return [];
    } else if (l <= 6) {
      mockL = l;
    } else {
      mockL = Math.min(l, l%7 + 6);
    }
    // cut data to mock length
    data.splice(mockL, l - mockL);

    // start from index 1
    for (var i = 1; i < mockL; i++) {
      validMsg[i].message.location.latitude = validMsg[i - 1].message.location.latitude + _randomDelta();
      validMsg[i].message.location.longitude = validMsg[i - 1].message.location.longitude + _randomDelta();
    };

    function _randomDelta() {
      return Math.random() * 0.01 - 0.005;
    }

    return validMsg;
  }

  // filter out useless messages, condition:
  // Two point distance greater than 400m
  function _filterMessage(m) {
    var validMsg = [];

    for (var i = 0; i < m.length; i++) {
      if (m[i].message.location) {
        if (validMsg.length !== 0) {
          if (_compareDist(m[i].message, validMsg[validMsg.length - 1])) {
            validMsg.push(m[i].message);
          }
        } else {
          validMsg.push(m[i].message);
        }
      }
    };

    return validMsg;
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
    var dLat = _deg2rad(lat2-lat1);  // deg2rad below
    var dLon = _deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) * 
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



'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', function ($scope, $http, socket, mapbox) {

  $scope.trackers = [];

  $http.get('/user/info').success(function(data) {
    $scope.user = data;

    // bind socket events
    bindSocket($scope, socket, mapbox);
    // bind UI events
    bindUIEvents($scope);

    $scope.$watch(function() {
      if ($scope.activeTracker) {
        return $scope.activeTracker.date;
      } else {
        return true;
      }
    }, queryHistory);

  });


  // get trackers current information
  // could get one or all trackers at a same query
  function queryCurrent(index) {
    var trackerInfo = [];

    if (index) {
      trackerInfo.push({
        'index': index,
        'serial': $scope.trackers[index].serialNum
      });

    } else {
      for (var i = 0; i < $scope.trackers.length; i++) {
        trackerInfo.push({
          'index': i,
          'serial': $scope.trackers[i].serialNum
        });
      };
    }

    socket.emit('get:current', trackerInfo);
  }

  // get active tracker history information
  function queryHistory() {
    var historyInfo;

    if ($scope.activeIndex) {
      historyInfo = {
        "index": $scope.activeIndex,
        "serial": $scope.activeTracker.serialNum,
        "date": $scope.activeTracker.date
      };

      socket.emit('get:history', historyInfo);
    }
  }

  function bindSocket($scope, socket, mapbox) {

    socket.on('connect', function () { 
      socket.emit('init:start', $scope.user._id);
    });

    socket.on('init:ok', function(data) {
      $scope.user = data.user;
      $scope.trackers = data.trackers;
      $scope.map = mapbox(data.trackers[0].current.latlng);

      for (var i = 0; i < data.trackers.length; i++) {
        $scope.map.addTracker(i, data.trackers[i].current.latlng);
      };

      // start update trackers current information
      $scope.setActiveTracker(0);
      queryCurrent();

    });

    socket.on('send:timeWeather', function(data) {
      $scope.timeWeather = data.city + ' ' + data.weather + ' ' + 
                           data.temperature + ' ' + data.time;
    });

    socket.on('send:current', function(data) {

      for (var i = 0; i < data.length; i++) {
        $scope.trackers[data[i].trackerIndex].current = data[i].data;
        $scope.map.updateTracker(data[i].trackerIndex, data[i].data.latlng, false);
      };

      //delay 1s to update trackers again... loop
      setTimeout(queryCurrent, 1000);
    });

    socket.on('send:history', function(trip) {
      $scope.trackers[trip.trackerIndex].history.data = [].concat(trip.data);
    });
  }

  function bindUIEvents(scope) {
    scope.setActiveTracker = function(index) {
      scope.activeTracker = scope.trackers[index];
      scope.activeIndex = index;
    };

    scope.hideHistoryTrip = function() {
      scope.map.hideTripHistory(scope.activeIndex);
    };

    scope.updateHistoryTrip = function(timeIndex) {
      var latlngs;

      scope.activeTracker.history.activeIndex  = timeIndex;
      latlngs = scope.activeTracker.history.data[timeIndex].geodata;
      scope.map.updateTripHistory(scope.activeIndex, latlngs);
    };

    scope.isHistoryItemSelected = function(index) {
      if (scope.activeTracker) {
        return scope.activeTracker.history.activeIndex  == index;
      } else {
        return false;
      }
    };

    scope.streetView = function() {
      //TODO
    };

    scope.latestTrail = function() {
      //TODO
    };

    scope.setUp = function() {
      //TODO
    };
  }

});



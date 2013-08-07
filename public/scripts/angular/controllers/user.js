'use strict';

/* Controllers */

angular.module('ten20Angular.controllers', []).
  controller('UserCtrl', function ($scope, $http, socket, mapbox) {

  $http.get('/user/info').success(function(data) {
    $scope.user = data;
  });

  $scope.trackers = [];
  $scope.currentInfo = {};
  $scope.history = {};

  //TODO:bindSocket($scope, socket, mapbox);
  bindUIEvents($scope);
  //TODO:queryCurrent();

  //TODO
  $scope.$watch(function() {
    if ($scope.activeTracker) {
      return $scope.activeTracker.date;
    } else {
      return true;
    }
  }, queryHistory);



  /* helper functions for controller */
  function queryCurrent() {
    var trackerSerials = [];

    socket.emit('get:current', trackerSerials);
  }

  function queryHistory() {
    /*TODO:OPEN
    var data = {
      "serial": $scope.activeTracker.serialNum,
      "date": $scope.activeTracker.date
    };

    socket.emit('get:history', data);
    */
  }

  function bindSocket($scope, socket, mapbox) {
    socket.on('connect', function () { 
      socket.emit('init:start', $scope.userId);
    });

    socket.on('init:ok', function(data) {
      $scope.user = data.user;
      $scope.trackers = data.trackers;
      $scope.map = mapbox(trackers[0].currentLocation);
    });

    socket.on('send:timeWeather', function(data) {
      $scope.timeWeather = data.city + data.weather + 
      data.temperature + data.time.toString();
    });

    socket.on('send:current', function(data) {
      $scope.currentInfo = data;
      $scope.map.updateCurrent(data);
      setTimeout(queryCurrent, 300);
    });

    socket.on('send:history', function(data) {
      $scope.history[data.trackerSerial].push = data.history; 
    });
  }

  function bindUIEvents(scope) {
    scope.setActiveTracker = function(index) {
      scope.activeTracker = scope.trackers[index];
    };

    scope.toggleHistoryTrip = function(timeIndex) {
      scope.activeTracker.history.activeIndex  = timeIndex;
      scope.map.updateHistory();
    };

    scope.isHistoryItemSelected = function(index) {
      if (scope.activeTracker) {
        return scope.activeTracker.history.activeIndex  == index;
      } else {
        return false;
      }
    };

    scope.streetView = function() {
      var serial = scope.activeTracker.serialNum;
      scope.map.toggleStreetView();
    };

    scope.latestTrail = function() {
      var serial = scope.activeTracker.serialNum;
      scope.map.updateHistory();
    };

    scope.setUp = function() {
      //TODO
    };
  }

  $scope.user = {
    id: "51f8cd02fb08a80618000001",
    name: "Daniel"
  };

  $scope.timeWeather =  "oslo cloudy -5.C wed jan 23 21:23";

  $scope.trackers = [
    {
      index: "one",
      serialNum: "2384390",
      location: {
        city: "San Francisco",
        date: "Wed, July 23",
        time: "19:35",
        weather: "cloudy"
      },
      current: {
        fence: "ON 7 km",
        actTime: "Today 11:45",
        elevation: "0 km",
        speed: "20 km"
      },
      history: {
        date: "12 December 2013",
        data: [
        {
          time: "09:00",
          geodata: []
        },
        {
          time: "10:00",
          geodata: []
        },
        {
          time: "11:00",
          geodata: []
        },
        {
          time: "12:00",
          geodata: []
        },
        {
          time: "13:00",
          geodata: []
        }
        ]
      }
    },
    {
      index: "two",
      serialNum: "2384391",
      location: {
        city: "San Francisco",
        date: "Wed, July 23",
        time: "19:35",
        weather: "cloudy"
      },
      current: {
        fence: "OFF",
        actTime: "Today 07:45",
        elevation: "13 km",
        speed: "0 km"
      },
      history: {
        date: "03 Octobor 2012",
        data: [
        {
          time: "09:00",
          geodata: []
        },
        {
          time: "10:00",
          geodata: []
        },
        {
          time: "11:00",
          geodata: []
        },
        {
          time: "12:00",
          geodata: []
        },
        {
          time: "13:00",
          geodata: []
        }
        ]
      }
    },
    {
      index: "three",
      serialNum: "2384392",
      location: {
        city: "San Francisco",
        date: "Wed, July 23",
        time: "19:35",
        weather: "cloudy"
      },
      current: {
        fence: "ON 6 km",
        actTime: "Today 18:45",
        elevation: "3 km",
        speed: "7 km"
      },
      history: {
        date: "12 December 2012",
        data: [
        {
          time: "09:00",
          geodata: []
        },
        {
          time: "10:00",
          geodata: []
        },
        {
          time: "11:00",
          geodata: []
        },
        {
          time: "12:00",
          geodata: []
        },
        {
          time: "13:00",
          geodata: []
        }
        ]
      }
    }
    ]
});



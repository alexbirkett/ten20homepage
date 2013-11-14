'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', function ($scope, $http, socket, mapbox) {

  $scope.trackers = [];

  $http.get('/user/info').success(function(userinfo) {
    $scope.user = userinfo;

    $http({
      url: '/trackers',
      method: "GET"
    }).success(function(trackers) {
      // init trackers
      initTrackers(trackers.items);
      // bind UI events
      bindUIEvents($scope);
      // bind socket events
      bindSocket($scope, socket);
      // init history date to today
      initHistory();

    });

  });


  // get trackers current information
  // could get one or all trackers at a same query
  function queryCurrent(index) {
    var trackerInfo = [];

    if (index) {
      trackerInfo.push($scope.trackers[index].serialNumber);

    } else {
      for (var i = 0; i < $scope.trackers.length; i++) {
        trackerInfo.push($scope.trackers[i].serialNumber);
      };
    }

    socket.emit('get:current', trackerInfo);
  }

  // get active tracker history information
  function queryHistory(index) {
    var historyInfo;

    historyInfo = {
      "index": index,
      "serial": $scope.trackers[index].serialNumber,
      "date": (new Date($scope.trackers[index].history.date)).valueOf()
    };

    socket.emit('get:history', historyInfo);
  }

  function initTrackers(trackers) {
    $scope.trackers = trackers;
    $scope.map = mapbox([trackers[0].latitude, trackers[0].longitude]);

    for (var i = 0; i < trackers.length; i++) {
      $scope.map.addTracker(i, [trackers[i].latitude, trackers[i].longitude]);
      $scope.trackers[i].activeTab = 'info-show';
    };


  }

  function bindSocket($scope, socket) {

    socket.on('connect', function() { 
      queryCurrent();
    });

    socket.on('timeWeather', function(data) {
      $scope.timeWeather = data.city + ' ' + data.weather + ' ' + 
                           data.temperature + ' ' + data.time;
    });

    socket.on('send:current', function(trackers) {
      var tmp;

      for (var i = 0; i < $scope.trackers.length; i++) {
        tmp = findTracker($scope.trackers[i].serialNumber, trackers);
        for (var key in tmp) {
          $scope.trackers[i][key] = tmp[key];
        };
        $scope.map.updateTracker($scope.trackers[i].index,
          [$scope.trackers[i].latitude, $scope.trackers[i].longitude], false);
      };

      function findTracker(serial, trackers) {
        for (var i = 0; i < trackers.length; i++) {
          if (serial === trackers[i].serialNumber) {
            return trackers[i];
          }
        };

        return null;
      }
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
      scope.activeTracker.activeTab = 'info-show';
      scope.map.hideTripHistory(scope.activeIndex);
    };

    scope.showHistoryTrip = function() {
      scope.activeTracker.activeTab = 'history-show';
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

    // start update trackers current information
    scope.setActiveTracker(0);

    setTimeout(function() {
      // expand first tracker
      $('.tracker-list').find('.tracker-header').first().click();
      // relocate date picker
      $('.history-date').datepicker("option", {
        beforeShow: function(input, inst) {
          var leftPos = $(input).parents('.date-select').offset().left - 300;
          var topPos = $(input).parents('.date-select').offset().top - 15;
          setTimeout(function () {
            inst.dpDiv.css({ top: topPos, left: leftPos});
          }, 0);
        }
      });

      // bind click event
      $('.date-select .media').click(function() {
        $(this).find('.history-date').datepicker('show');
      });
    }, 0);
  }

  function initHistory() {
    var months = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"],
        weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
    var today = new Date();
    var dayStr = weekday[today.getDay() - 1] + ', ' + 
                 today.getDate() +  ' ' +
                 months[today.getMonth()] + ', ' +
                 today.getFullYear();

    for (var i = 0; i < $scope.trackers.length; i++) {
      $scope.trackers[i].history = {};
      $scope.trackers[i].history.date = dayStr;
      // watch history date change
      (function (index) {
        $scope.$watch('trackers[' + index + '].history.date', 
          function() { queryHistory(index); });
      })(i);
    };
  }

});



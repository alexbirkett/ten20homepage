'use strict';

/* Controllers */

angular.module('ten20Angular.controllers').
  controller('UserCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
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

  var delay = 1; // delay seconds for get trip message
  function getMessages() {
    var start = new Date().valueOf();
    $http.get('/message/notify').success(function (tracker) {
      var newTracker = true;

      // server response time less than One secend
      if ((new Date().valueOf()) - start < 1000) {
        delay *= 2;
      } else {
        // reset delay
        delay = 1;
      }

      console.log(tracker.name + ' udpated');
      // update or add tracker
      for (var i = 0; i < $scope.trackers.length; i++) {
        if ($scope.trackers[i]._id === tracker._id) {
          // save recent and trips
          tracker.recent = $scope.trackers[i].recent;
          tracker.trips = $scope.trackers[i].trips;
          $scope.trackers[i] = tracker;
          newTracker = false;
        }
      };
      if (newTracker) {
        $scope.trackers.push(tracker);
      }

      $scope.$broadcast('TrackerUpdate', tracker);
      $timeout(getMessages, delay * 1000);

    }).error(function() {
      delay *= 2;
      $timeout(getMessages, delay * 1000);
    });
  }

  getMessages();

  // refresh tracker
  $scope.refreshTracker = function(t) {
    $scope.activeTracker = t;
    $scope.$broadcast('FocusTracker', t);
    $scope.recentMsg(t);
  };

  // load recent msg of a tracker
  $scope.recentMsg = function(t) {
    $http.get('/recent_messages?trackerId=' + t._id).success(function(data) {
      console.log('------recent_message-----');
      t.recent = t.recent || {};
      t.recent.msgs = _filterValidMsg(data.items);
      console.log(t.recent.msgs);
      if (t.recent.msgs.length > 1) {
        t.path = t.recent.msgs;
        $scope.$broadcast('PathUpdate', t);
      }
    });
  }
  
  // load trips of at tracker
  $scope.showTrip = function(t, index) {
      t.path = t.trips.data[index].messages;
      t.trips.active = index;
      $scope.$broadcast('PathUpdate', t);
  };

  $scope.loadTrips = function (tracker, init) {
    var BATCH = 3; // load trip counts per time
    // prevent load more if user secondly click trip tab
    if (init && tracker.trips &&
        tracker.trips.data.length !==0) {
      return;
    }

    tracker.trips ? null: tracker.trips = { data:[], destCnt: 0 };
    tracker.trips.destCnt = tracker.trips.data.length + BATCH;

    _getOneTrip(tracker);
  };

  // get one trip from server
  function _getOneTrip(tracker) {
    var trips = tracker.trips;
    var before = '';
    var url;

    if (trips.length > 0) {
      before = '&_id=before$' + trips[trips.length - 1]._id;
    }

    url = '/trips?sortBy=_id$desc&limit=1&trackerId=' + tracker._id + before;
    console.log(url);

    $http.get(url).success(function (documents) {
      if (documents.items.length > 0) {
        trips.data.push(_simplifyTripMsg(documents.items[0]));
        // get next trip
        if (trips.data.length < tracker.trips.destCnt) {
          _getOneTrip(tracker);
        }
      }
    });
  };

  function _simplifyTripMsg(trip) {
    // cut useless info in trip messages
    trip.messages = _filterValidMsg(trip.messages);

    return trip;
  }

  function _filterValidMsg(data) {
    var validMsg = [];

    // filter out useless messages
    for (var i = 0; i < data.length; i++) {
      if (data[i].message && data[i].message.location) {
        validMsg.push(data[i].message.location);
      }
    }

    return validMsg;
  }

}]);



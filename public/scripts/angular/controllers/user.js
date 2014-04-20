'use strict';

/* Controllers */

angular.module('ten20Angular').
  controller('UserCtrl', ['$scope', '$http', '$timeout', '$window', '$modal', function ($scope, $http, $timeout, $window, $modal) {
  // init user and trackers information
  $scope.user = {};
  $scope.newTracker = {};
  $scope.trackerLoaded = false;
  $scope.trackers = [];
  $scope.adsFree = true; // initially hide ads

  // update features
  function _getFeature() {
    $http.get('/features').success(function(data) {
      if (data.adFree) {
        $scope.adsFree = true;
      } else {
        $scope.adsFree = false;
      }
    }).error(function(error) {
      $scope.adsFree = false;
    });
  }

  $scope.adsShow = function() {
    var desktopWin = true;
    var status = { desk: false, mobile: false};

    if ($window.innerWidth < 600) {
      desktopWin = false;
    }

    if (!$scope.adsFree) {
      if (desktopWin) {
        status.desk = true;
      } else {
        status.mobile = true;
      }
    }

    return status;
  };

  // callback for add tracker modal box
  $scope.addTracker = function() {
    $scope.trackers.push($scope.newTracker);
    $scope.newTracker = {};
  };

  // callback for tracker setting modal box
  function updateSetting(id, data) {

    $http({ 
      method: 'PATCH', 
      url: '/trackers/'+id,
      data: data
    });
  };

  function deleteTracker(t) {
    for (var i = 0; i < $scope.trackers.length; i++) {
      if ($scope.trackers[i]._id === t._id) {
        $scope.trackers.splice(i, 1);
        $http.delete('/trackers/' + t._id);
      }
    };
  }

  $scope.openSetting = function(t) {

    var SettingCtrl = function($scope, $modalInstance) {
      var setInstance = $modalInstance;
      $scope.data = {
          iconColor: t.iconColor,
          name: t.name,
          serial: t.serial
      };

      $scope.ok = function() {
        jQuery.extend(t, $scope.data);
        $scope.$broadcast('TrackerUpdate', t);
        $scope.$broadcast('PathUpdate', t);
        updateSetting(t._id, $scope.data);
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
       
      $scope.deleteTracker = function(tracker) {

        var DeleteCtrl = function($scope, $modalInstance) {
          $scope.t = tracker;

          $scope.ok = function() {
            deleteTracker(t);
            $modalInstance.close();
            setInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

        };

        var deleteModal = $modal.open({
          templateUrl: '/templates/deleteTracker.html',
          controller: DeleteCtrl,
          windowClass: 'small'
        });

      };
    };

    var setModal = $modal.open({
      templateUrl: '/templates/trackerSetting.html',
      controller: SettingCtrl,
      windowClass: 'small'
    });

  };

  // get user account info
  $scope.init = function() {
    $http.get('/user/info').success(function(userinfo) {
      $scope.user = userinfo;
      _getFeature();
      initTrackers();
    }).error(function(data, status, headers, config) {
      if (status === 401) {
        angular.element(document.body).find('.bottom-nav .signin').click();
      }
    });
  }

  // get trackers info
  function initTrackers() { 
    $http.get('/trackers').success(function(data) {
      $scope.trackers = data.items;
      // hack icon color format
      for (var i = 0; i < $scope.trackers.length; i++) {
        if ($scope.trackers[i].iconColor) {
          if ($scope.trackers[i].iconColor.charAt(0) !== '#') {
            $scope.trackers[i].iconColor = '#' + $scope.trackers[i].iconColor;
          }
        } else {
          $scope.trackers[i].iconColor = '#ff6600';
        }
      };
      $scope.trackerLoaded = true;
      $scope.$broadcast('InitTrackers');
      getMessages();
    }).error(function() {
      $scope.trackerLoaded = true;
    });
  }

  $scope.init();

  var delay = 1; // delay seconds for get trip message
  function getMessages() {
    var start = new Date().valueOf();
    $http.get('/message/notify').success(function (tracker) {
      var newTracker = true;
      var oldPos = {};

      // server response time less than One secend
      if ((new Date().valueOf()) - start < 5000) {
        delay *= 5;
      } else {
        // reset delay
        delay = 1;
      }

      // update or add tracker
      for (var i = 0; i < $scope.trackers.length; i++) {
        if ($scope.trackers[i]._id === tracker._id) {
          // add point to recent
          if ($scope.trackers[i].lastMessage.location) {
            $scope.trackers[i].recent = $scope.trackers[i].recent || {msgs:[]};
            $scope.trackers[i].recent.msgs.unshift(
              $scope.trackers[i].lastMessage.location);
            $scope.trackers[i].recent.msgs.splice(
              $scope.trackers[i].recent.msgs.length - 1, 1);

            // only update path when active tracker's trip pane is not show
            if (!$scope.activeTracker ||
                $scope.activeTracker._id !== $scope.trackers[i]._id ||
                !$scope.trackers[i].tripActive) {

                  $scope.trackers[i].path = $scope.trackers[i].recent.msgs;
                  $scope.$broadcast('PathUpdate', $scope.trackers[i], false);
             }
          }
          // override with new info
          for (var key in tracker) {
            $scope.trackers[i][key] = tracker[key];
          }

          newTracker = false;
        }
      }

      if (newTracker) {
        if (newTracker.iconColor) {
          if ( newTracker.iconColor.charAt(0) !== '#') {
            newTracker.iconColor = '#' + newTracker.iconColor;
          }
        } else {
          newTracker.iconColor = '#ff6600';
        }

        $scope.trackers.push(tracker);
      }

      $scope.$broadcast('TrackerUpdate', tracker);
      $timeout(getMessages, delay * 1000);

    }).error(function() {
      delay *= 2;
      $timeout(getMessages, delay * 1000);
    });
  }


  // refresh tracker
  $scope.refreshTracker = function(t) {
    $scope.activeTracker = t;
    $scope.$broadcast('FocusTracker', t);
    $scope.recentMsg(t);
  };

  // load recent msg of a tracker
  $scope.recentMsg = function(t) {

    if (t.recent && t.recent.msgs.length !== 0) {
      t.path = t.recent.msgs;
      $scope.$broadcast('PathUpdate', t, true);
      return;
    }

    var url = '/recent_messages?sortBy=_id$desc&trackerId=' + t._id;
    console.log('recent message url ' + url);
    $http.get(url).success(function(data) {
      console.log('------recent_message-----');
      t.recent = t.recent || {};
      t.recent.msgs = _filterValidMsg(data.items);
      if (t.recent.msgs.length > 1) {
        t.path = t.recent.msgs;
        $scope.$broadcast('PathUpdate', t, true);
      }
    });
  }
  
  $scope.onTripTimeSet = function(newOne, oldOne) {
    var date, filtered, 
        url = '/trips?limit=1&sortBy=_id$asc&trackerId=' + 
          $scope.activeTracker._id,
        tracker = $scope.activeTracker;

    tracker.trips.error = '';
    tracker.trips.loading = true;
    tracker.trips.data = [];

    date = moment(newOne).toISOString();
    url += '&endTime=after$date:' + date;
    url += '&startTime=before$date:' + date;

    $http.get(url).success(function (documents) {
      if (documents.items.length > 0) {
        filtered = _simplifyTripMsg(documents.items[0]);
        if (filtered.messages.length === 0) {
          tracker.trips.loading = false;
          tracker.trips.error = 'trips data invalid';
          $timeout(function() { tracker.trips.error = ''; }, 10 * 1000);
          return;
        }
        tracker.trips.data.push(filtered);
        tracker.trips.loading = false;
        tracker.trips.error = '';
      } else {
        tracker.trips.loading = false;
        tracker.trips.error = 'no trip data at this time';
        $timeout(function() { tracker.trips.error = ''; }, 10 * 1000);
      }
    }).error(function(data) {
      tracker.trips.error = data;
      tracker.trips.loading = false;
      $timeout(function() { tracker.trips.error = ''; }, 5000);
    });
  };

  // load trips of at tracker
  $scope.showTrip = function(t, index) {
      t.path = t.trips.data[index].messages;
      t.trips.active = index;
      $scope.$broadcast('PathUpdate', t, true);
  };

  $scope.loadTrips = function (tracker, init) {
    var BATCH = 3; // load trip counts per time

    if (tracker.trips && tracker.trips.search !== '') {
      return;
    }

    if (tracker.trips && tracker.trips.error !== '') {
      return;
    }

    // prevent load more if user secondly click trip tab
    if (init && tracker.trips &&
        tracker.trips.data.length !==0) {
      $scope.showTrip(tracker, 0);
      return;
    }

    tracker.trips ? null: tracker.trips = { data:[], destCnt: 0, error: '' , search: ''};
    tracker.trips.destCnt = tracker.trips.data.length + BATCH;
    tracker.trips.loading = true;
    tracker.trips.error = '';

    _getOneTrip(tracker);
  };

  // get one trip from server
  function _getOneTrip(tracker) {
    var trips = tracker.trips;
    var before = '';
    var url, filtered;

    if (trips.data.length > 0) {
      before = '&_id=before$' + trips.data[trips.data.length - 1]._id;
    }

    url = '/trips?sortBy=_id$desc&limit=1&trackerId=' + tracker._id + before;

    $http.get(url).success(function (documents) {
      if (documents.items.length > 0) {
        filtered = _simplifyTripMsg(documents.items[0]);
        if (filtered.messages.length === 0) {
          tracker.trips.loading = false;
          tracker.trips.error = 'trips data invalid, retry later';
          $timeout(function() { tracker.trips.error = ''; }, 10 * 1000);
          return;
        }
        trips.data.push(filtered);
        // get next trip
        if (trips.data.length < tracker.trips.destCnt) {
          _getOneTrip(tracker);
        } else {
          tracker.trips.loading = false;
        }
        tracker.trips.error = '';
      } else {
        tracker.trips.loading = false;
        tracker.trips.error = 'no more trips, retry later';
        $timeout(function() { tracker.trips.error = ''; }, 10 * 1000);
      }
    }).error(function(data) {
      tracker.trips.error = data;
      tracker.trips.loading = false;
      $timeout(function() { tracker.trips.error = ''; }, 5000);
    });
  };

  function _simplifyTripMsg(trip) {
    // cut useless info in trip messages
    trip.messages = _filterValidMsg(trip.messages);

    return trip;
  }

  function _filterValidMsg(data) {
    var validMessages = [];

    // filter out useless messages
    for (var i = 0; i < data.length; i++) {
       var message = data[i].message;
       if (message) {
           var location = message.location;
           if (location && location.latitude && location.longitude) {
               validMessages.push(location);
           }
       }
    }
    return validMessages;
  }

  $scope.signout = function() {
      $window.localStorage.token = undefined;
      $window.location = '/'; //("http://ten20live.com/");
  };

}]);



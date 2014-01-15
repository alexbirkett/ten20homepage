'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('userConsole', function() {
    return {
			templateUrl: '/templates/userConsole.html',
			restrict: 'A',
			replace: true,
      link: function(scope, element, attrs) {
        // bind tracker accordion click to update tracker data
        element.delegate('.panel-heading a', 'click', function(e) {
          var panelScope = $(e.target).parents('.panel').scope();

          if (panelScope.isopen) {
            scope.refreshTracker(panelScope.tracker);
          }
        });
      }
    };
  }).
  directive('userMap', function($timeout) {
    return {
			restrict: 'A',
      scope: true,
      controller: function($scope, $element, $attrs) {
        // init trackers
        function _initTrackers() {
          // check whether user has trackers
          if ($scope.trackers.length === 0) {
            return;
          }

          for (var i = 0; i < $scope.trackers.length; i++) {
            if ($scope.trackers[i].lastMessage.location) {
              $scope.userMap.updateTracker($scope.trackers[i], true);
            }
          };
        }

        // init map
        function _initMap() {
          var center = {}, params;

          // set center to first locatable tracker 
          if ($scope.trackers.length !== 0) {
            for (var i = 0; i < $scope.trackers.length; i++) {
              if ($scope.trackers[i].lastMessage.location) {
                center.lat = $scope.trackers[i].lastMessage.location.latitude;
                center.lng = $scope.trackers[i].lastMessage.location.longitude;
                break;
              }
            };
          }
          // fallback to hard-code location 
          if (!center.lat) {
            center.lat = 52.8009421020332;
            center.lng = -1.6183757697247896;
          }

          params = {
            "lat": center.lat,
            "lng": center.lng,
            "zoomLevel":14,
            "zoomControl":true,
            "tile":"alexbirkett.map-t0fodlre",
            "layers":[
              {
                "label":"Satellite",
                "tileLayer":"alexbirkett.map-t0fodlre"
              },
              {
                "label":"Map",
                "tileLayer":"alexbirkett.map-bugector"
            }
            ]
          };

          $scope.userMap = new ten20.UserMap($attrs.id, params);
          
          // add trackers
          $timeout(_initTrackers, 500);

          // bind map zoom event
          $scope.userMap.map.on('zoomend', function() {
            if ($scope.activeTracker) {
              _updateRecent(null, $scope.activeTracker);
            }
          });
        }

        $scope.$on('InitMap', _initMap);
        $scope.$on('TrackerUpdate', _updateTracker);
        $scope.$on('FocusTracker', _focusTracker);
        $scope.$on('RecentUpdate', _updateRecent);
        $scope.$on('TripUpdate', _updateTrip);

        // center map to tracker location
        function _focusTracker(e, t) {
          $scope.userMap.updateTracker(t, true);
        }

        function _updateTracker(e, t) {
          $scope.userMap.updateTracker(t);
        }

        // show recent msg on map for a tracker
        function _updateRecent(e, t) {
          if (t.recent && t.recent.msgs.length !== 0) {
            $scope.userMap.updateTail(t);
          }
        }

        // show recent msg on map for a tracker
        function _updateTrip(e, t, timespan) {
          if (t.trip && t.trip.msgs.length !== 0) {
            $scope.userMap.updateTrip(t);
          }

        }

      },
      link: function(scope, elem, attrs) {
        // bind accordion click, set active tracker
      }
    };
  });

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

          window.mapboxMap = $scope.userMap.map;
          // bind map zoom event
          $scope.userMap.map.on('zoomend', function() {
            if ($scope.activeTracker) {
              $scope.userMap.updatePath($scope.activeTracker, false);
            }
          });
        }

        $scope.$on('InitMap', _initMap);
        $scope.$on('TrackerUpdate', _updateTracker);
        $scope.$on('FocusTracker', _focusTracker);
        $scope.$on('PathUpdate', _updatePath);

        // center map to tracker location
        function _focusTracker(e, t) {
          $scope.userMap.updateTracker(t, true);
        }

        function _updateTracker(e, t) {
          $scope.userMap.updateTracker(t);
        }

        // show recent or trip msg as path on map for a tracker
        function _updatePath(e, t) {
          if (t.path && t.path.length !== 0) {
            $scope.userMap.updatePath(t, true);
          }
        }

      },
      link: function(scope, elem, attrs) {
        // bind accordion click, set active tracker
      }
    };
  });

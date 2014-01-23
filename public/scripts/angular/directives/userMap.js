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

        // bind tracker tab click to update tracker recent or trip
        element.delegate('.nav-tabs a', 'click', function(e) {
          var tracker = $(e.target).parents('.panel').scope().tracker;
          var infoTab = $(e.currentTarget).parent().hasClass('info-tab');

          if (infoTab) {
            tracker.tripActive = false;
            scope.recentMsg(tracker);
          } else {
            tracker.tripActive = true;
            scope.loadTrips(tracker, true);
          }
        });

        // make tool box draggable
         var toolbox = element.find('.tool-box')[0];
         var handle = element.find('.tool-box .time-weather')[0];
         draggable(toolbox, handle);

      }
    };
  }).
  directive('userMap', function($timeout) {
    return {
			restrict: 'A',
      scope: true,
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        // init trackers
        function _initTrackers() {
          var bounds = [];
          // check whether user has trackers
          if ($scope.trackers.length === 0) {
            return;
          }

          for (var i = 0; i < $scope.trackers.length; i++) {
            if ($scope.trackers[i].lastMessage.location) {
              bounds.push([
                $scope.trackers[i].lastMessage.location.latitude,
                $scope.trackers[i].lastMessage.location.longitude
              ]);
              $scope.userMap.updateTracker($scope.trackers[i], true);
            }
          };

          $scope.userMap.map.fitBounds(bounds, {
            paddingTopLeft: L.point(100, 100),
            paddingBottomRight: L.point(350, 350)
          });
        }

        // init map
        function _initMap() {
          var params;

          // fallback to hard-code location 
          params = {
            "lat": 0,
            "lng": 0,
            "zoomLevel": 6,
            "zoomControl":true,
            "layers":[
              {
                "label":"Map",
                "tileLayer":"alexbirkett.map-bugector"
              },
              {
                "label":"Satellite",
                "tileLayer":"alexbirkett.map-t0fodlre"
              }
            ]
          };

          $scope.userMap = new ten20.UserMap($attrs.id, params);
          
          // bind map zoom event
          $scope.userMap.map.on('zoomend', function() {
            if ($scope.activeTracker) {
              $scope.userMap.updatePath($scope.activeTracker, false);
            }
          });
        }

        _initMap();
        $scope.$on('InitTrackers', _initTrackers);
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
        function _updatePath(e, t, quiet) {
          if (t.path && t.path.length !== 0) {
            $scope.userMap.updatePath(t, quiet);
          }
        }

      }],
      link: function(scope, elem, attrs) {
        // bind accordion click, set active tracker
      }
    };
  });

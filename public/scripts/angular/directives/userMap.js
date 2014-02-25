'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('userConsole', ['$window', '$timeout', function($window, $timeout) {
    return {
			templateUrl: '/templates/userConsole.html',
			restrict: 'A',
			replace: true,
      link: function(scope, element, attrs) {
        // enable toolbox to off canvas in small screens;
        scope.toggleTB = function(action) {
          if (action === 'on') {
            element.children('#map').addClass('off-canvas');
          } else if (action === 'off') {
            element.children('#map').removeClass('off-canvas');
          } else {
            element.children('#map').toggleClass('off-canvas');
          }
          //scope.$broadcast('ResizeMap');
        };
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

        function _setToolBoxHeight() {
          var timerId = null;
          return function() {
            $timeout.cancel(timerId);
            timerId = $timeout(function() {
              var height = Math.floor(element.height() * 0.8) - 100;
              $(toolbox).find('.panel-group').css('max-height', height + 'px');
            }, 100);
          }
        }
        // make tool box draggable
        var toolbox = element.find('.tool-box')[0];
        // enable drag on big screens
        if ($window.innerWidth > 767) {
          new Draggabilly(toolbox, {
            containment: '.user-page',
            handle: '.time-weather'
          });

          _setToolBoxHeight()();

          angular.element($window).on('resize', function() {
            _setToolBoxHeight()();
          });
        }
      }
    };
  }]).
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
            if ($scope.trackers[i].location &&
                $scope.trackers[i].location.latitude) {
              bounds.push([
                $scope.trackers[i].location.latitude,
                $scope.trackers[i].location.longitude
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
            "scrollWheelZoom": true,
            "layers":[
              {
                "label":"Satellite",
                "tileLayer":"https://api.tiles.mapbox.com/v3/alexbirkett.map-t0fodlre/{z}/{x}/{y}.png"
              },
              {
                "label":"Map",
                "tileLayer":"https://api.tiles.mapbox.com/v3/alexbirkett.map-bugector/{z}/{x}/{y}.png"
              }
            ]
          };

          $scope.userMap = new ten20.UserMap($attrs.id, params);
          
          // bind map zoom event
          $scope.userMap.map.on('zoomend', function() {
            if ($scope.activeTracker) {
              _updatePath(null, $scope.activeTracker, false);
            }
          });
        }

        _initMap();
        $scope.$on('InitTrackers', _initTrackers);
        $scope.$on('TrackerUpdate', _updateTracker);
        $scope.$on('FocusTracker', _focusTracker);
        $scope.$on('PathUpdate', _updatePath);
        $scope.$on('ResizeMap', function() {
          $scope.userMap.map.invalidateSize();
        });

        // center map to tracker location
        function _focusTracker(e, t) {
          if (t.location &&
              t.location.latitude) {
                $scope.userMap.updateTracker(t, true);
          }
        }

        function _updateTracker(e, t) {
          if (t.location &&
              t.location.latitude) {
                $scope.userMap.updateTracker(t);
          }
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

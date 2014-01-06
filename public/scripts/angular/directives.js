'use strict';

/* Directives */

angular.module('ten20Angular.directives', []).
  directive('userConsole', function() {
    return {
			templateUrl: '/templates/userConsole.html',
			restrict: 'A',
			replace: true
    };
  }).
  directive('userMap', function($timeout) {
    return {
			restrict: 'A',
      scope: true,
      controller: function($scope, $element, $attrs) {
        // add tracker to map
        $scope.addTracker = function() {
          // body...
        };
        // add trip to map
        $scope.addTrip = function () {
          // body...
        };
        // remove trip
        $scope.removeTrip = function() {

        };
        // update tracker location
        $scope.updateTrackerLoc = function() {
          // body...
        };
        // init map
        function _initMap() {
          var center = {}, params;

          // set center to first locatable tracker 
          if ($scope.trackers.length !== 0) {
            for (var i = 0; i < $scope.trackers.length; i++) {
              if ($scope.trackers[i].lastMessage) {
                center.lat = $scope.trackers[i].lastMessage.latitude;
                center.lng = $scope.trackers[i].lastMessage.longitude;
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

          console.log('id: ' + $attrs.id);
          $scope.map = new ten20.UserMap($attrs.id, params);
        }

        $scope.$on('InitMap', _initMap);

      },
      link: function(scope, elem, attrs) {
      }
    };
  });

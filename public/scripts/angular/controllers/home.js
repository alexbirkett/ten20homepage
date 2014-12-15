'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('HomeCtrl', ['$scope', 'MAP_URL', function ($scope, MAP_URL) {

    $scope.masterMap = {
      "lat": 51.74,
      "lng": -4.55,
      "zoomLevel": 12,
      "numberOfTrackers": 5,
      "zoomControl": true,
      "showTail": true,
      "layers": [
        {"label": "Satellite",  "tileLayer": MAP_URL.satellite},
        { "label": "Map", "tileLayer": MAP_URL.map}
      ]
    };

    $scope.featuresMap = [
      {
        "lat": 52.80113,
        "lng": -1.63130,
        "zoomLevel": 16,
        "restrict": true,
        "numberOfTrackers": 1,
        "showTail": false,
        "followFirstTracker": true,
        "addVirtualFence": false,
        "tile": "https://ten20live.com/v2/tiles/{z}/{x}/{y}.png"
      },
      {
        "lat": 52.80113,
        "lng": -1.63130,
        "zoomLevel": 15,
        "restrict": true,
        "numberOfTrackers": 1,
        "showTail": true,
        "followFirstTracker":true,
        "addVirtualFence": false,
        "tile": "https://ten20live.com/v2/tiles/{z}/{x}/{y}.png"
      }
    ];

}]);


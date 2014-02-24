'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('HomeCtrl', function ($scope) {

    $scope.masterMap = {
      "lat": 51.74,
      "lng": -4.55,
      "zoomLevel": 12,
      "numberOfTrackers": 5,
      "zoomControl": true,
      "showTail": true,
      "layers": [
      {"label": "Satellite",  "tileLayer": "https://api.tiles.mapbox.com/v3/alexbirkett.map-t0fodlre/{z}/{x}/{y}.png"},
      { "label": "Map", "tileLayer": "https://api.tiles.mapbox.com/v3/alexbirkett.map-bugector/{z}/{x}/{y}.png"}
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
        "tile": "https://api.tiles.mapbox.com/v3/alexbirkett.map-bugector/{z}/{x}/{y}.png"
      },
      {
        "lat": 32.062472,
        "lng": 118.778056,
        "zoomLevel": 15,
        "restrict": true,
        "numberOfTrackers": 1,
        "showTail": true,
        "followFirstTracker":true,
        "addVirtualFence": false,
        "tile": "https://api.tiles.mapbox.com/v3/alexbirkett.map-bugector/{z}/{x}/{y}.png"
      }
    ];

});


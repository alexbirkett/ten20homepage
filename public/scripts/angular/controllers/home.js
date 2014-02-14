'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('HomeCtrl', function ($scope) {
    $scope.navs = [
      {
        "text": "Supported hardware",
        "link": "/#supported",
        "scroll": "true"
      },
      {
        "modal": true,
        "id": "contact",
        "text": "Contact Us"
      },
      {
        "modal": false,
        "link": "/console",
        "text": "sign in"
      },
      {
        "text": "About Us",
        "link": "#about-us",
        "scroll": "true"
      }
      /*
      {
        "text": "FAQ",
        "link": "/#faq",
        "scroll": "true"
      }
      */
    ];

    $scope.masterMap = {
      "lat": 51.74,
      "lng": -4.55,
      "zoomLevel": 12,
      "numberOfTrackers": 5,
      "zoomControl": true,
      "showTail": true,
      "layers": [
      {"label": "Satellite",  "tileLayer": "alexbirkett.map-t0fodlre"},
      { "label": "Map", "tileLayer": "alexbirkett.map-bugector"}
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
        "tile": "alexbirkett.map-bugector"
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
        "tile": "alexbirkett.map-bugector"
      },
      {
        "lat": 59.93245,
        "lng": 10.79090,
        "zoomLevel": 13,
        "restrict": true,
        "numberOfTrackers": 0,
        "showTail": false,
        "followFirstTracker": false,
        "addVirtualFence":true,
        "tile": "alexbirkett.map-bugector"
      }
    ];

});


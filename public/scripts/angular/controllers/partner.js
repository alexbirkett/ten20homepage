'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('PartnerCtrl', function ($scope) {

    $scope.masterMap = {
      "zoomLevel": 6,
      "lat": -24.73685,
      "lng":130.18799,
      "numberOfTrackers": 5,
      "zoomControl": true,
      "showHistory": true,
      "tile": "alexbirkett.map-t0fodlre",
      "layers": [
      {"label": "Satellite",  "tileLayer": "alexbirkett.map-t0fodlre"},
      { "label": "Map", "tileLayer": "alexbirkett.map-bugector"}
      ]
    };

});


'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ten20Angular.services', []).
  factory('mapbox', function () {
    return function(latlng) {
      var params = {
        "lat": latlng[0],
        "lng": latlng[1],
        "zoomLevel":14,
        "usermap": true,
        "zoomControl":true,
        "tile":"alexbirkett.map-t0fodlre",
        "layers":[{"label":"Satellite","tileLayer":"alexbirkett.map-t0fodlre"},{"label":"Map","tileLayer":"alexbirkett.map-bugector"}]
      };
      return new ten20.MapRender('map', params);
    };
  }).
  value('version', '0.0.1');

'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ten20Angular.services', []).
  factory('mapbox', function () {
    // body...
    return {
      updateCurrent: function() {},
      updateHistory: function() {},
      toggleStreetView: function() {}
    };
  }).
  value('version', '0.0.1');

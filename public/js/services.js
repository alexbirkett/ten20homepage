'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var app = angular.module('ten20.services', []).
  value('version', '0.1');

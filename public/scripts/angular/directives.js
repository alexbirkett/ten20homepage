'use strict';

/* Directives */

angular.module('ten20Angular.directives', []).
  directive('userMap', function() {
    return {
			templateUrl: '/templates/mapTracker.html',
			restrict: 'A',
			replace: true
    };
  });

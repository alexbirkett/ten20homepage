'use strict';

/* Directives */

angular.module('ten20Angular.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });

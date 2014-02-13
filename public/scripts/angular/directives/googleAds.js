'use strict';

/*  home map direcitve */
angular.module('ten20Angular').
  directive('googleAds', function() {
    return {
      templateUrl: 'templates/googleAds.html',
			restrict: 'A',
      link: function(scope, element, attrs) {
      }
    };
  });

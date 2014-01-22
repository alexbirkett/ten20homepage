'use strict';

/*  home map direcitve */
angular.module('ten20Angular').
  directive('homeMap', function() {
    return {
      scope: {
        mapData: '='
      },
			restrict: 'A',
      link: function(scope, element, attrs) {
        var id = element.attr('id');
        new ten20.HomeMap(id, scope.mapData);
      }
    };
  });

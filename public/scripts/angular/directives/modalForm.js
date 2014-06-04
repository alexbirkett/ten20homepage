'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('modelForm', function() {
    return {
			restrict: 'A',
      scope: {
        srcModel: "=?", // data model bind to the modal dialog template
        requestProp: "@", // data field that send to server in srcModel
        tplUrl: "@",  // modal dialog template url
        method: "@",  // server request method, POST, PUT, etc
        path: "@",   // server request path
        dialogClass: "@",   // modal dialog width
        redirect: "@",    // redirect on success
        close: "@closeOnSuccess",    // redirect on success
        callback: "&"   // callback function
      },
      controller: ['$scope', 'formService', function($scope, formService) {
        $scope.open = formService($scope);
      }],
      link: function(scope, element, attrs) {
        element.click(function() {scope.open();});
      }
    };
  });

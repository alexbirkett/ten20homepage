'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('modelForm', function() {
    return {
			restrict: 'A',
      scope: {
        dataSrc: "=", // data model bind to the modal dialog template
        tplUrl: "@",  // modal dialog template url
        method: "@",  // server request method, POST, PUT, etc
        path: "@"     // server request path
      },
      controller: ['$scope', '$modal', function($scope, $modal) {

        $scope.open = function () {

        var modalInstance = $modal.open({
          templateUrl: $scope.tplUrl,
          controller: ModalInstanceCtrl,
          resolve: {
            data: function () {
              return $scope.dataSrc;
            }
          }
        });

        modalInstance.result.then(function (data) {
          $scope.submitData = data;
        }, function () {
        });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

          $scope.data = data;

          $scope.submit = function () {
            $modalInstance.close($scope.data);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };

      }],
      link: function(scope, element, attrs) {
        element.click(function() {scope.open();});
      }
    };
  });

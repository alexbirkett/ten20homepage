'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('modelForm', function() {
    return {
			restrict: 'A',
      scope: {
        srcModel: "=", // data model bind to the modal dialog template
        tplUrl: "@",  // modal dialog template url
        method: "@",  // server request method, POST, PUT, etc
        path: "@",   // server request path
        dialogClass: "@"   // modal dialog width
      },
      controller: ['$scope', '$modal', function($scope, $modal) {

        $scope.open = function () {

          var modalInstance = $modal.open({
            templateUrl: $scope.tplUrl,
            controller: ModalInstanceCtrl,
            resolve: {
              config: function () {
                return {
                  src: $scope.srcModel,
                  ajaxMethod: $scope.method,
                  ajaxUrl: $scope.path,
                  width: $scope.width
                };
              }
            },
            windowClass: $scope.dialogClass
          });

          modalInstance.result.then(function (data) {
            $scope.submitData = data;
          }, function () {
          });
        };

        var ModalInstanceCtrl = function($scope, $http, $modalInstance, config) {

          $scope.data = config.src;

          $scope.ok = function () {
            $scope.showLoadingBar = true;
            $http({
              method: config.ajaxMethod,
              url: config.ajaxUrl,
              data: config.src
            }).success(function () {
              console.log('reqeust success');
            }).error(function (argument) {
              console.log('reqeust fail');
            });
            //$modalInstance.close($scope.data);
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

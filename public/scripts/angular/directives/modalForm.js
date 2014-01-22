'use strict';

/*  user map direcitve */

angular.module('ten20Angular').
  directive('modelForm', function() {
    return {
			restrict: 'A',
      scope: {
        srcModel: "=", // data model bind to the modal dialog template
        requestProp: "@", // data field that send to server in srcModel
        tplUrl: "@",  // modal dialog template url
        method: "@",  // server request method, POST, PUT, etc
        path: "@",   // server request path
        dialogClass: "@",   // modal dialog width
        redirect: "@"    // redirect on success
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
                  field: $scope.requestProp,
                  redirect: $scope.redirect
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

        var ModalInstanceCtrl = function($scope, $http, $window, $timeout, $modalInstance, config) {

          $scope.sync = false;
          $scope.error = '';
          $scope.data = config.src;

          $scope.formInvalid = false;

          $scope.ok = function (f) {

            // input invalid
            if (f.$invalid) {
              $scope.formInvalid = true;
              return;
            }

            $scope.sync = true;
            $http({
              method: config.ajaxMethod,
              url: config.ajaxUrl,
              data: config.field?config.src[config.field]:config.src
            }).success(function() {
              if (config.redirect) {
                $window.location.hash = "";
                $window.location.pathname = config.redirect;
              } else {
                $scope.succ = true;
                $scope.sync = false;
                $timeout(function() { $scope.succ = '';}, 10000);
              }
            }).error(function(error) {
              $scope.sync = false;
              $scope.error = error.message;
              $timeout(function() { $scope.error = '';}, 10000);
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

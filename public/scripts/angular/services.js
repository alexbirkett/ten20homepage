'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('ten20Angular.services', []).factory('formService', ['$modal', '$log', function ($modal, $log) {

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

      if (config.ajaxUrl && config.ajaxMethod) {
        $scope.sync = true;
        $http({
          method: config.ajaxMethod,
          url: config.ajaxUrl,
          data: config.field?config.src[config.field]:config.src
        }).success(function(data, status, headers, cfg) {
          if (config.redirect) {
            $window.location.hash = "";
            $window.location.pathname = config.redirect;
          } else {
            if (config.cb) {
              config.cb();
            }

            if (config.closeOnSucc) {
              $modalInstance.close();
            }
            $scope.succ = true;
            $scope.sync = false;
            $timeout(function() { $scope.succ = '';}, 10000);
          }
        }).error(function(error) {
          $scope.sync = false;
          $scope.error = error.message;
          $timeout(function() { $scope.error = '';}, 10000);
        });
      } else {
        if (config.cb) {
          config.cb();
        }

        if (config.closeOnSucc) {
          $modalInstance.close();
        }
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };

  function openModal(params) {
    var modalInstance = $modal.open({
      templateUrl: params.tplUrl,
      controller: ModalInstanceCtrl,
      resolve: {
        config: function () {
          return {
            src: params.srcModel || {},
            ajaxMethod: params.method,
            ajaxUrl: params.path,
            field: params.requestProp,
            redirect: params.redirect,
            cb: params.callback,
            closeOnSucc: params.close
          };
        }
      },
      windowClass: params.dialogClass
    });

    modalInstance.result.then(function (data) {
      $scope.submitData = data;
    }, function () {
      $log.info('modal dismissed.');
    });
  };

  return function(params) {
    return openModal.bind(null, params);
  };
}]).factory('authInterceptor', ['$rootScope', '$q', '$window', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      var token = $window.localStorage.token;
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function (response) {
      if (response.config &&
          response.config.url == "/authenticate" &&
            response.data &&
              response.data.token) {
        $window.localStorage.token = response.data.token
      }
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401 && rejection.config.url == "/user/info") {
        console.log('need signin');
        $rootScope.$broadcast('UNAUTHORIZED');
      }
      return $q.reject(rejection);
    }
  };
}]);

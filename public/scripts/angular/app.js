'use strict';

// Declare app level module which depends on filters, and services
angular.module('ten20Angular', [
  'ten20Angular.filters',
  'ten20Angular.services',
  'ui.bootstrap',
  'angular-gestures',
  'colorpicker.module',
  'ui.bootstrap.datetimepicker',
  'ui.keypress'
]).factory('authInterceptor', function ($rootScope, $q, $window) {
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
             if (rejection.status === 401) {
                   setTimeout(function() {
                     console.log('clicking signin');
                     angular.element(document.body).find('.bottom-nav .signin').click();
                 }, 100);
            }
            return $q.reject(rejection);
        }
    };
}).config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    }
}]).run(function () {
  // config moment calendar
  moment.lang('en', {
    calendar: {
      lastDay : '[Yesterday at] LT',
      sameDay : '[Today at] LT',
      nextDay : '[Tomorrow at] LT',
      lastWeek : '[Last] dddd [at] LT',
      nextWeek : 'dddd [at] LT',
      sameElse : 'YYYY-MM-DD LT'
    }
  });
});

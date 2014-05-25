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
            console.log('sending ' + $window.localStorage.token);
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
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

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
]).config(['$httpProvider', function($httpProvider) {
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

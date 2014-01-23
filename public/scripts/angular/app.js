'use strict';

// Declare app level module which depends on filters, and services
angular.module('ten20Angular', [
  'ten20Angular.filters',
  'ten20Angular.services',
  'ngGrid',
  'ui.bootstrap'
]).run(function ($rootScope) {
  // config moment calendar
  moment.lang('en', {
    calendar: {
      lastDay : '[Yesterday at] LT',
      sameDay : '[Today at] LT',
      nextDay : '[Tomorrow at] LT',
      lastWeek : '[Last] dddd [at] LT',
      nextWeek : 'dddd [at] LT',
      sameElse : 'L'
    }
  });

  $rootScope.cookies = "Like most websites Ten20 uses cookies in order to deliver a personalised, responsive service and to improve the site. This is done using simple text files called cookies which sit on your computer. These cookies are completely safe and secure and will never contain any sensitive information.";


  $rootScope.pageTitle = "ten20 - Track the location of people and things";

  $rootScope.metaDescription = "Track the location of people and things using GPS trackers and mobile apps";

  $rootScope.metaKeywords = "GPS, tracking, Xenun, GOTOP, Globalsat, TL-201, TL-206, Tk103, TK201-2, GPS108, TR-203";
});

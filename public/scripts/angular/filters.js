'use strict';

/* Filters */

angular.module('ten20Angular.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }).
  filter('timeFormat', function () {
    return function(time, key) {
      var t = new Date(time);

      if (!time) {
        return 'not available';
      }

      if (key === 'date') {
        return t.toDateString();
      }

      if (key === 'time') {
        return t.toTimeString().split(' ')[0];
      }

      if (key === 'from') {
        return moment(t).fromNow();
      }
    }
  }).
  filter('tripTime', function() {
    return function(time, key) {
      return moment(time).calendar();
    };
  });

// Karma E2E configuration

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['ng-scenario'],
// base path, that will be used to resolve files and exclude
basePath : '',

// list of files / patterns to load in the browser
files : [
  'test/e2e/*.js'
],

// list of files to exclude
exclude : [],

// test results reporter to use
// possible values: dots || progress || growl
reporters : ['progress'],

// web server port
port : 9876,

// cli runner port
runnerPort : 9200,

// enable / disable colors in the output (reporters and logs)
colors : true,

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel : config.LOG_INFO,

proxies : {
  // change this if you've changed your grunt server port. default is 3000
      '/': 'http://127.0.0.1:3000/'
},

// enable / disable watching file and executing tests whenever any file changes
autoWatch : false,

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers : ['Chrome'],

// If browser does not capture in given timeout [ms], kill it
captureTimeout : 5000,

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun : true,

urlRoot : '/__karma/'
  });
};


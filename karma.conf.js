// Karma configuration

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
  // base path, that will be used to resolve files and exclude

  // list of files / patterns to load in the browser
    files : [
      'public/components/jquery/jquery.js',
      'public/components/hammerjs/hammer.min.js',
      'public/components/jcarousel/dist/jquery.jcarousel.js',
      'public/components/angular/angular.js',
      'public/components/angular-gestures/gestures.js',
      'public/components/ng-grid/ng-grid-2.0.7.debug.js',
      'public/components/angular-mocks/angular-mocks.js',
      'public/components/bootstrap/dist/js/bootstrap.js',
      'public/components/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'public/components/momentjs/moment.js',
      'public/components/drag-plugin/index.js',
      'public/scripts/*.js',
      'public/templates/*.html',
      'public/scripts/**/*.js',
      'test/lib/**/*.js',
      'test/spec/**/*.js'
    ],
    // list of files to exclude
    exclude : [],
    // test results reporter to use
    // possible values: dots || progress || growl
    reporters : ['progress'],
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel : config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch : true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers : ['PhantomJS'],

    preprocessors: {
      'public/templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public',

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'LoadTpl'
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout : 5000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun : false
  });
};

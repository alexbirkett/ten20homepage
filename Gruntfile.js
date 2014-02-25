///*jshint indent:4*/
// Generated on 2013-05-01 using generator-webapp 0.1.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'



module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    // configurable paths
    pkg: grunt.file.readJSON('package.json'),

    // compress js files
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> minified scripts <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false //{ except: ['jQuery', 'angular'] }
      },
      build: {
        files: {
          '<%= pkg.src.build %>/app.min.js':['<%= pkg.src.build %>/.temp/app.js']
        }
      },
      preMinLib: {
        files: {
          '<%= pkg.src.lib %>/css3-query/css3-mediaqueries.min.js':['<%= pkg.src.lib %>/css3-query/css3-mediaqueries.js'],
          '<%= pkg.src.lib %>/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js':
            ['<%= pkg.src.lib %>/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js'],
          '<%= pkg.src.lib %>/angular-bootstrap-datetimepicker/src/js/datetimepicker.min.js':
            ['<%= pkg.src.lib %>/angular-bootstrap-datetimepicker/src/js/datetimepicker.js']
        }
      }
    },

    // compress css files
    cssmin: {
      minify: {
        options: {
          banner: '/*! <%= pkg.name %> minified css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
           '<%= pkg.src.build %>/lib.min.css': ['<%= pkg.src.build %>/.temp/lib.css'],
           '<%= pkg.src.build %>/app.min.css': ['<%= pkg.src.build %>/.temp/app.css']
        }
      }
    },

    // concat js files
    concat: {
      libJs: {
        options: {
          separator: '\n',
        },
        src: [
          '<%= pkg.src.lib %>/css3-query/css3-mediaqueries.min.js',
          '<%= pkg.src.lib %>/html5shiv/dist/html5shiv.js',
          '<%= pkg.src.lib %>/jquery/jquery.min.js',
          '<%= pkg.src.lib %>/hammerjs/hammer.min.js',
          '<%= pkg.src.lib %>/jcarousel/dist/jquery.jcarousel.min.js',
          '<%= pkg.src.lib %>/drag-plugin/index.js',
          '<%= pkg.src.lib %>/momentjs/min/moment.min.js',
          '<%= pkg.src.lib %>/leaflet-dist/leaflet.js',
          '<%= pkg.src.lib %>/bootstrap/dist/js/bootstrap.min.js',
          '<%= pkg.src.lib %>/angular/angular.min.js',
          '<%= pkg.src.lib %>/angular-gestures/gestures.min.js',
          '<%= pkg.src.lib %>/angular-bootstrap/ui-bootstrap.min.js',
          '<%= pkg.src.lib %>/angular-bootstrap/ui-bootstrap-tpls.min.js',
          '<%= pkg.src.lib %>/angular-ui-utils/keypress.min.js',
          '<%= pkg.src.lib %>/ng-grid/ng-grid-2.0.7.min.js',
          '<%= pkg.src.lib %>/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js',
          '<%= pkg.src.lib %>/angular-bootstrap-datetimepicker/src/js/datetimepicker.min.js',
        ],
        dest: '<%= pkg.src.build %>/lib.js'
      },
      appJs: {
        options: {
          separator: ';',
        },
        src: ['<%= pkg.src.script %>/*.js', '<%= pkg.src.script %>/angular/**/*.js'],
        dest: '<%= pkg.src.build %>/.temp/app.js'
      },
      libCss: {
        src: [
        '<%= pkg.src.lib %>/bootstrap/dist/css/bootstrap.min.css',
        '<%= pkg.src.lib %>/bootstrap/dist/css/bootstrap-theme.min.css',
        '<%= pkg.src.lib %>/leaflet-dist/leaflet.css',
        '<%= pkg.src.lib %>/ng-grid/ng-grid.min.css',
        '<%= pkg.src.lib %>/angular-bootstrap-colorpicker/css/colorpicker.css',
        '<%= pkg.src.lib %>/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
        ],
        dest: '<%= pkg.src.build %>/.temp/lib.css'
      },
      appCss: {
        src: [
        '<%= pkg.src.css %>/*.css'
        ],
        dest: '<%= pkg.src.build %>/.temp/app.css'
      }
    },

    clean: ["<%= pkg.src.build %>"],
    // start node app
    express: {
        dev: {
          options: {
            args: ['-O'],
            script: 'app.js',
            node_env: 'development'
          }
        },
        prod: {
          options: {
            args: ['-p 3000', '-s 4403', '-k key.pem', '-c cert.pem'],
            script: 'app.js',
            node_env: 'production'
          }
        },
        test: {
          options: {
            script: 'test/server.js'
          }
        }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      e2e: {
       configFile: 'karma-e2e.conf.js'
      }
    },

   // watch node process
    watch: {
      dev: {
        files:  [ 'app/*/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      prod: {
        files:  [ 'app/*/*.js' ],
        tasks:  [ 'express:prod' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    preprocess : {
      dev: {
        files: {
          'app/views/partials/build/head.jade':'app/views/partials/head.jade'
        },
        options: {
          context : {
            production: false
          }
        }
      },
      prod: {
        files: {
          'app/views/partials/build/head.jade':'app/views/partials/head.jade'
        },
        options: {
          context : {
            production: true
          }
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
        }
      }
    },

    bgShell: {
      _defaults: {
        bg: true
      },
      kill: {
        cmd: 'pkill -f "node app -O"',
        stdout: false,
        stderr: false
      },
      server: {
        cmd: 'node app -O',
        stdout: false,
        stderr: true
      }
    },

    shell: {
      gen_key: {
        options: {
          stdout: true,
          stderr: true
        },
          command: './generateKey.sh'
      }
    },

    exec: {
      mocha_api: {
        command: 'mocha node_modules/ten20api/test/trackers.js -R spec --timeout 15000',
        stdout: true,
        stderr: true
      }
    }

  });


  grunt.registerTask('default', [
      'clean',
      'uglify:preMinLib',
      'concat',
      'uglify:build',
      'cssmin',
      'preprocess:prod'
      ]);

  grunt.registerTask('product', [
      'default',
      'shell:gen_key',
      'express:prod',
      'watch:prod'
      ]);

  grunt.registerTask('develop', [
      'preprocess:dev',
      'express:dev',
      'watch:dev'
      ]);

  grunt.registerTask('test', [
      'bgShell',
      'exec:mocha_api',
      'karma'
      ]);

  grunt.registerTask('test:angular', [
      'bgShell',
      'karma'
      ]);
  grunt.registerTask('test:unit', [
      'karma:unit'
      ]);
};

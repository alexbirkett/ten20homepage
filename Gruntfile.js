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
        files: [{
          expand: true,
          src: ['*.js'],
          dest: 'public/build/',
          cwd: 'public/build/.temp',
          ext: '.min.js'
        }]
      }
    },

    // compress css files
    cssmin: {
      minify: {
        options: {
          banner: '/*! <%= pkg.name %> minified css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
           'public/build/all.min.css': [ '<%= pkg.src.css %>/*.css']
        }
      }
    },

    // concat js files
    concat: {
      home: {
        options: {
          separator: ';',
        },
        src: ['<%= pkg.src.script %>/*.js'],
        dest: 'public/build/.temp/home.js'
      },
      angular: {
        options: {
          separator: ';',
        },
        src: ['<%= pkg.src.script %>/angular/**/*.js'],
        dest: 'public/build/.temp/angular-all.js'
      }
    },

    clean: ["public/build"],
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
      'concat',
      'uglify',
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

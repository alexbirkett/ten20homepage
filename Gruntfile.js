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
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: [{
          expand: true,
          src: ['*.js', '!*.min.js'],
          dest: '<%= pkg.src.script %>',
          cwd: '<%= pkg.src.script %>/src',
          ext: '.min.js'
        }]
      }
    },

    // compress css files
    cssmin: {
      minify: {
        expand: true,
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.src.css %>',
        cwd: '<%= pkg.src.css %>/src',
        ext: '.min.css'
      }
    },

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
            args: ['-p 80', '-s 443'],
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

   // watch node process
    watch: {
      dev: {
        files:  [ 'app/data/*.json', 'app/*/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      prod: {
        files:  [ 'app/data/*.json', 'app/*/*.js' ],
        tasks:  [ 'express:prod' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },


  });

  grunt.registerTask('default', [
      'uglify',
      'cssmin'
      ]);

  grunt.registerTask('product', [
      'uglify',
      'cssmin',
      'express:prod',
      'watch:prod'
      ]);

  grunt.registerTask('develop', [
      'express:dev',
      'watch:dev'
      ]);

  grunt.registerTask('test', [
      'uglify',
      'cssmin',
      'express:test'
      ]);
};

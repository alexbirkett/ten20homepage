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

  // configurable paths

  grunt.initConfig({

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
        cwd: 'release/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'release/css/',
        ext: '.min.css'
      },
      combine: {
        files: {
          'path/to/output.css': ['path/to/input_one.css', 'path/to/input_two.css']
        }
      },
      add_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          'path/to/output.css': ['path/to/**/*.css']
        }
      }
    }

  });

  grunt.registerTask('default', [
      'uglify'
      ]);

};

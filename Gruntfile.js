var util = require('./lib/grunt');
module.exports = function(grunt) {
  grunt.initConfig({
    root: __dirname,


    bower_copy: {
      bower: {
        files: [{
          expand: true,
          cwd: 'bower_components/angular',
          src: ['angular.js'],
          dest: 'build/js'
        }, {
          expand: true,
          cwd: 'bower_components/angular-animate',
          src: 'angular-animate.js',
          dest: 'build/js'
        }, {
          expand: true,
          cwd: 'bower_components/angular-route',
          src: ['angular-route.js'],
          dest: 'build/js'
        }, {
          expand: true,
          cwd: 'bower_components/underscore.string/lib',
          src: ['underscore.string.js'],
          dest: 'build/js'
        }]
      },
      example: {
        files: [{
          expand: true,
          cwd: 'example',
          src: ['**/*.html', '**/*.tpl'],
          dest: 'build'
        }]
      },
      example_css: {
        files: [{
          expand: true,
          cwd: 'example',
          src: ['assets/css/*.css'],
          dest: 'build'
        }]
      },
      example_img: {
        files: [{
          expand: true,
          cwd: 'example',
          src: ['assets/img/**/*'],
          dest: 'build'
        }]
      },
      example_assets: {
        files: [{
          expand: true,
          cwd: 'example',
          src: ['assets/**/*', '!example/assets/img/**/*', '!example/assets/css/**/*'],
          dest: 'build'
        }]
      }
    },


    concat: {
      example_js: {
        src: ['example/js/app.js', 'example/js/**/*.js'],
        dest: 'build/js/app.js'
      }
    },


    connect: {
      server: {
        options: {
          livereload: true,
          keepalive: true,
          base: 'build',
          port: process.env.PORT || 8000
        },
      }
    },


    exampleCode: {
      code: {
        files: [{
          src: ['example/views/code/**/*.code'],
          dest: 'build/js/examplecode.js'
        }]
      }
    },


    "ghPages": {
      options: {
        base: "build",
        branch: "gh-pages",
        repo: "https://github.com/caitp/ng-media.git"
      },
      src: ["**/*"]
    },


    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          angular: true
        },
      },
      lib: {
        src: ['src/**/*.js'],
      },
      test: {
        src: ['test/**/*.js'],
        options: {
          globals: {
            module: true,
            inject: true,
            expect: true
          }
        }
      }
    },


    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        background: true
      },
      continuous: {
        singleRun: true
      },
      jenkins: {
        singleRun: true,
        colors: false,
        reporter: ['dots', 'junit'],
        browsers: [
          'Chrome',
          'ChromeCanary',
          'Firefox',
          'Opera',
          '/Users/jenkins/bin/safari.sh',
          '/Users/jenkins/bin/ie9.sh'
        ]
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS', 'Firefox']
      }
    },


    parallel: {
      server: {
        tasks: [{
          grunt: true,
          args: ['watch']
        }, {
          grunt: true,
          args: ['connect:server']
        }]
      }
    },


    watch: {
      example_html: {
        files: ['example/**/*.html', 'example/**/*.tpl'],
        tasks: ['bower_copy:example'],
        options: {
          livereload: true
        }
      },
      example_css: {
        files: ['example/assets/**/*.css'],
        tasks: ['bower_copy:example_css'],
        options: {
          livereload: true
        }
      },
      example_js: {
        files: ['example/**/*.js'],
        tasks: ['concat:example_js'],
        options: {
          livereload: true
        }
      },
      example_img: {
        files: ['example/assets/img/**/*'],
        tasks: ['copy:example_img'],
        options: {
          livereload: true
        }
      },
      example_assets: {
        files: ['example/assets/**/*', '!example/assets/img/**/*', '!example/assets/css/**/*'],
        tasks: ['copy:example_assets'],
        options: {
          livereload: true
        }
      },
      src: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    }
  });

  [
    'grunt-contrib-concat',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-contrib-jshint',
    'grunt-contrib-watch',
    'grunt-gh-pages',
    'grunt-karma',
    'grunt-parallel'
   ].forEach(grunt.loadNpmTasks);

  grunt.loadTasks('lib/grunt');

  grunt.renameTask('gh-pages', 'ghPages');
  grunt.registerTask('default', ['bower', 'jshint', 'build', 'test']);
  grunt.registerTask('example', 'Build example files', ['build', 'bower_copy', 'concat']);
  grunt.registerTask('gh-pages', 'Push gh-pages site', ['example', 'ghPages']);
  grunt.registerTask('server', 'Run development server', ['example', 'parallel:server']);
  grunt.registerTask('test', 'Run tests', ['bower', 'karma:continuous']);
};

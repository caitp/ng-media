module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    autoWatch: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    browsers: ['Firefox'],
    browserDisconnectTimeout: 5000,

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'css/**/*.css',
      'src/**/*.js',
      'test/**/*.helper.js',
      'test/**/*.spec.js'
    ],

    reporters: ['dots', 'coverage'],

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    junitReporter: {
      outputFile: 'test_out/jqlite.xml',
      suite: 'jqLite'
    },

    coverageReporter: {
      reporters: [{
        type: 'lcov',
        dir: 'coverage/'
      }, {
        type: 'text'
      }]
    }
  });

  if (process.env.TRAVIS) {
    config.reporters.push('coveralls');
  }

  function arrayRemove(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }
  if (process.argv.indexOf('--debug') >= 0) {
    arrayRemove(config.reporters, 'coverage');
    for (var key in config.preprocessors) {
      arrayRemove(config.preprocessors[key], 'coverage');
    }
  }
};

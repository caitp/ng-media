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
    },

    sauceLabs: {
      testName: 'ngMedia',
      startConnect: true,
      options: {
        'selenium-version': '2.46.0'
      }
    },


    customLaunchers: {
      // Sauce Labs browsers
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '37'
      },
      'SL_Safari': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8'
      }
    },
  });

  if (process.env.TRAVIS) {
    config.reporters.push('coveralls');
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

    // TODO(caitp): remove once SauceLabs supports websockets.
    // This speeds up the capturing a bit, as browsers don't even try to use websocket.
    config.transports = ['xhr-polling'];
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

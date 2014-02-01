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

    reporters: ['dots', 'growl'],

    junitReporter: {
      outputFile: 'test_out/jqlite.xml',
      suite: 'jqLite'
    }
  });
};

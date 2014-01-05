var app = angular.module("media.example", ["ngAnimate", "ngRoute", "media"]);

var tour = [
  { url: '/', description: 'ng-media for AngularJS' },
  { url: '/video', description: 'Directive: html5-video' },
  { url: '/video/overlay', description: 'html5-video overlay' },
  { url: '/fin', description: 'End of tour' }
];

app
  .config(function($routeProvider) {
    $routeProvider
      .when('', {
        templateUrl: 'partials/intro.html'
      })
      .when('/', {
        templateUrl: 'partials/intro.html'
      })
      .when('/video', {
        templateUrl: 'partials/video.html',
        controller: 'videoController'
      })
      .when('/video/overlay', {
        templateUrl: 'partials/video.overlay.html',
        controller: 'videoOverlayController'
      })
      .when('/fin', {
        templateUrl: 'partials/fin.html'
      })
      .when('/404', {
        templateUrl: 'partials/404.html',
        controller: '404Controller'
      })
      .otherwise({ redirectTo: '/404' });
  })
  .run(function($rootScope) {
    $rootScope.navoptions = tour;
    $rootScope.$on('$routeChangeError', function($event) {
      $location.path('/404');
    });
  });

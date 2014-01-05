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

app.controller('404Controller', function($scope, $location, $timeout) {
  $scope.time = 10;
  $scope.home = '/';
  $timeout(countdown, 1000);

  function countdown() {
    if ($scope.time-- === 0) {
      $location.path('/');
    } else {
      $timeout(countdown, 1000);
    }
  }
});

app
  .controller({
    videoController: function($scope) {
      $scope.mode = "example";
    },
    videoOverlayController: function($scope) {
      $scope.mode = "example";
    }
  });

app
  .directive('addClass', function($timeout) {
    return function(scope, element, attr) {
      $timeout(function() {
        element.addClass(attr.addClass);
      }, 666); // this is pretty arbitrary, I know.
    }
  });

app
  .directive('navScroller', function($compile, $rootScope) {
    return {
      restrict: "A",
      require: 'navScroller',
      templateUrl: 'partials/nav-scroller.html',
      replace: true,
      scope: {
        "routes": "=navScroller"
      },
      controller: function($scope, $location) {
        var items = [], current, deltaY = 0, self = this, deltaThreshold = 1000, lastkey;

        bind();

        function unbind() {
          angular.element(document)
            .off('wheel', wheelnav)
            .off('keydown keyup', keynav);
        }

        function bind() {
          angular.element(document)
            .bind('wheel', wheelnav)
            .bind('keydown keyup', keynav);
        }

        function nav(next) {
          deltaY = 0;
          if (next) {
            if (self.$selectRoute(next.$route())) {
              $scope.$apply(function() {
                $location.path(current.$route());
              });
              unbind();
              setTimeout(bind, 500);
            }
          }
        }

        function keynav(event) {
          if (event.type === 'keydown') {
            lastkey = event.which;
          } else if (event.type === 'keyup' && event.which === lastkey) {
            var i = self.$index(current);
            if (event.which === 38) {
              nav(items[i-1]);
            } else if (event.which === 40) {
              nav(items[i+1]);
            }
          }
        }

        function wheelnav(event) {
          deltaY += event.wheelDeltaY;
          var next;
          if (items.length) {
            var i = self.$index(current);
            if (deltaY <= -deltaThreshold) {
              nav(next = items[i+1]);
            } else if (deltaY >= deltaThreshold) {
              nav(items[i-1]);
            }
          }
        }

        this.$index = function(navItem) {
          for (var i = 0; i < items.length; ++i) {
            if (navItem === items[i]) {
              return i;
            }
          }
          return -1;
        }

        this.$addItem = function(navItem) {
          items.push(navItem);
          if ($location.path() === navItem.$route()) {
            this.$selectRoute(navItem.$route());
          }
        };
        this.$selectRoute = function(route) {
          if (current) {
            if (route === current.$route()) {
              return;
            }
            current = current.$deselect();
          }
          for (var i=0; i < items.length; ++i) {
            var item = items[i];
            if (item.$route() === route) {
              current = item.$select();
              return true;
            }
          }
        };
      },
      link: function($scope, $element, $attr, self) {
        angular.forEach($scope.routes, function(route) {
          var description = route;
          if (typeof route === 'object') {
            description = route.description;
            route = route.url;
          }
          var template = '<nav data-nav-scroller-item="' + route + '" data-nav-description="' + description + '"></nav>';
          $compile(template)($scope, function(dom) {
            $element.append(dom);
          });
        });

        $rootScope.$on('$routeChangeSuccess', function($event, $route) {
          self.$selectRoute($route.$$route.originalPath);
        });
      }
    };   
  })
  .directive('navScrollerItem', function() {
    return {
      restrict: "A",
      require: ['navScrollerItem', '^navScroller'],
      templateUrl: 'partials/nav-scroller-item.html',
      replace: true,
      scope: true,
      controller: function($scope, $element, $attrs) {
        var route = $scope.route = $attrs.navScrollerItem;
        $scope.description = $attrs.navDescription;
        this.$route = function() {
          return route;
        };
        this.$select = function() {
          $attrs.$addClass('active');
          return this;
        };
        this.$deselect = function() {
          $attrs.$removeClass('active');
        }
      },
      link: function($scope, $element, $attr, $controllers) {
        $controllers[1].$addItem($controllers[0]);
      }
    };
  });

app
  .directive('switcher', function($compile) {
    return {
      restrict: "A",
      require: ['switcher', 'ngModel'],
      templateUrl: 'partials/nav-switcher.html',
      replace: true,
      controller: function() {
        var items = [], current;
        this.$addItem = function(navItem) {
          items.push(navItem);
          if (navItem.$name() === this.$model.$viewValue) {
            this.$select(navItem);
          }
        };
        this.$find = function(item) {
          for (var i = 0; i < items.length; ++i) {
            var $it = items[i];
            if ($it.$name() === item) {
              return $it;
            }
          }
        };
        this.$select = function(item) {
          if (typeof item === 'string') {
            item = this.$find(item);
          }
          if (!item) {
            return;
          }
          if (current) {
            current = current.$deselect();
          }
          current = item.$select();
          this.$model.$setViewValue(item.$name());
        };
      },
      link: function($scope, $element, $attr, $controllers) {
        var $self = $controllers[0], $model = $controllers[1];
        $self.$model = $model;
        var items = ($attr.switcher || '').split('|');
        angular.forEach(items, function(item) {
          var template = '<nav data-switcher-item="' + item + '"></nav>';
          $compile(template)($scope, function(dom) {
            $element.append(dom);
          });
        });
        $model.$formatters.unshift(function(value) {
          $self.$select(value);
          return value;
        });
      }
    };
  })
  .directive('switcherItem', function() {
    return {
      restrict: "A",
      require: ['switcherItem', '^switcher'],
      templateUrl: 'partials/nav-switcher-item.html',
      replace: true,
      scope: true,
      controller: function($scope, $element, $attrs) {
        var name = $scope.switcherItem = $attrs.switcherItem || '';
        this.$name = function() {
          return name;
        };
        this.$select = function() {
          $attrs.$addClass('active');
          return this;
        };
        this.$deselect = function() {
          $attrs.$removeClass('active');
        }
      },
      link: function($scope, $element, $attr, $controllers) {
        $controllers[1].$addItem($controllers[0]);
        $element.bind('click touch', function() {
          $scope.$apply(function() {
            $controllers[1].$select($controllers[0]);
          });
        });
      }
    };
  });

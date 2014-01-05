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

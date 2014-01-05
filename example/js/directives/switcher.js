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

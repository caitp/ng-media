app
  .directive('addClass', function($timeout) {
    return function(scope, element, attr) {
      $timeout(function() {
        element.addClass(attr.addClass);
      }, 666); // this is pretty arbitrary, I know.
    }
  });

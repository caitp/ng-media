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

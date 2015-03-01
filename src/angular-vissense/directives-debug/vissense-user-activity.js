(function (angular) {
  angular.module('angular-vissense.directives.debug')
    .directive('vissenseUserActivity', ['VisSense', 'VisUtils', function (VisSense, VisUtils) {
      var d = {
        scope: {
          inactiveAfter: '@',
          debounce: '@'
        },
        controller: ['$scope', '$interval', function ($scope, $interval) {
          $scope.options = {
            inactiveAfter: $scope.inactiveAfter || 30000,
            debounce: $scope.debounce || 100
          };

          $scope.active = true;
          $scope.installed = VisUtils.isFunction(VisSense.UserActivity);

          if ($scope.installed) {
            var activityMonitor = new VisSense.UserActivity($scope.options).start();

            var intervalId = $interval(function () {
              $scope.active = activityMonitor.isActive();
            }, 1000);

            $scope.$on('$destroy', function () {
              $interval.cancel(intervalId);
            });
          }
        }],
        template: '<span>user active: ' +
        '<span data-ng-style="{ color : active ? \'green\' : \'red\'}">{{active}}</span>' +
        '<span data-ng-if="!installed"> (not installed)</span>' +
        '</span>'
      };

      return d;
    }])
  ;

})(angular);

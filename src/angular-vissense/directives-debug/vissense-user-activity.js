(function (angular) {
  angular.module('angular-vissense.directives.debug')
    .directive('vissenseUserActivity', ['VisSense', 'VisUtils', function (VisSense, VisUtils) {
      var d = {
        scope: {
          inactiveAfter: '@',
          debounce: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.active = true;
          $scope.installed = VisUtils.isFunction(VisSense.UserActivity);

          if ($scope.installed) {
            $scope.options = {
              inactiveAfter: parseInt($scope.inactiveAfter, 10) || 30000,
              debounce: parseInt($scope.debounce, 10) || 50,
              update: VisUtils.debounce(function(activityMonitor) {
                $scope.active = activityMonitor.isActive();
                $scope.$digest();
              }, 10)
            };

            var activityMonitor = new VisSense.UserActivity($scope.options).start();
            $scope.$on('$destroy', function () {
              activityMonitor.stop();
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

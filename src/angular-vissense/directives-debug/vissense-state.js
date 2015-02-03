(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissenseState', ['VisSenseService', 'VisUtils', '$timeout',
      function (VisSenseService, VisUtils, $timeout) {

      var d = {
        scope: {
          elementId: '@vissenseState',
          fullyvisible: '@',
          hidden: '@',
          strategy: '@'
        },
        link: function($scope) {
          $scope.state = '?';

          $timeout(function() {
            var vismon = VisSenseService.fromId($scope.elementId, {
              fullyvisible: parseFloat($scope.fullyvisible) || 1,
              hidden: parseFloat($scope.hidden) || 0
            }).monitor({
              visibilitychange: VisUtils.debounce(function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state().state;
                });
              }, 10)
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          });
        },
        template: '<span>{{state}}</span>'
      };

      return d;
    }])

    .directive('vissenseStateDebug', ['VisSenseService',  'VisUtils', '$timeout',
      function (VisSenseService, VisUtils, $timeout) {
      var d = {
        scope: {
          elementId: '@vissenseStateDebug'
        },
        controller: ['$scope', function($scope) {
          $scope.state = {};
          $timeout(function() {
            var vismon = VisSenseService.fromId($scope.elementId).monitor({
              update: VisUtils.debounce(function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state();
                });
              }, 10)
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          });
        }],
        template: '{{ state | json }}'
      };

      return d;
    }])
  ;

})(angular);

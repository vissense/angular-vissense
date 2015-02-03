(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissenseState', ['VisSenseService', '$timeout', function (VisSenseService, $timeout) {

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
              visibilitychange: function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state().state;
                });
              }
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          }, 1);
        },
        template: '<span>{{state}}</span>'
      };

      return d;
    }])

    .directive('vissenseStateDebug', ['VisSenseService', function (VisSenseService) {
      var d = {
        scope: {
          elementId: '@vissenseStateDebug'
        },
        controller: ['$scope', function($scope) {
          $scope.state = {};
          var vismon = VisSenseService.fromId($scope.elementId).monitor({
            update: function(monitor) {
              $scope.$apply(function() {
                $scope.state = monitor.state();
              });
            }
          }).start();

          $scope.$on('$destroy', function() {
            vismon.stop();
          });
        }],
        template: '{{ state | json }}'
      };

      return d;
    }])
  ;

})(angular);

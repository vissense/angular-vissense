(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissensePercentage', ['VisSenseService', '$timeout', function (VisSenseService, $timeout) {

      var d = {
        scope: {
          elementId: '@vissensePercentage'
        },
        controller: ['$scope', function($scope) {
          $scope.percentage = '?';
          $timeout(function() {
            var vismon = VisSenseService.fromId($scope.elementId).monitor({
              percentagechange: function() {
                $scope.$apply(function() {
                  $scope.percentage = vismon.state().percentage;
                });
              }
            });

            $scope.$on('$destroy', function() {
              vismon.stop();
            });

            VisSenseService.startMonitorAsync(vismon);
          });
        }],
        template: '<span>' +
          '{{percentage * 100 | number:0}}%' +
        '</span>'
      };

      return d;
    }])
  ;

})(angular);

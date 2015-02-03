(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissensePercentage', ['VisSenseService', 'VisUtils', '$timeout',
      function (VisSenseService, VisUtils, $timeout) {

      var d = {
        scope: {
          elementId: '@vissensePercentage'
        },
        controller: ['$scope', function($scope) {
          $scope.percentage = '?';
          $timeout(function() {
            var vismon = VisSenseService.fromId($scope.elementId).monitor({
              percentagechange: VisUtils.debounce(function() {
                $scope.$apply(function() {
                  $scope.percentage = vismon.state().percentage;
                });
              }, 10)
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
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

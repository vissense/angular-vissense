(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissensePercentage', ['VisSenseService', function (VisSenseService) {

      var d = {
        scope: {
          elementId: '@vissensePercentage'
        },
        controller: ['$scope', function($scope) {
          $scope.percentage = '?';

          var vismon = VisSenseService.fromId($scope.elementId).monitor({
            percentagechange: function() {
              $scope.$apply(function() {
                $scope.percentage = vismon.state().percentage;
              });
            }
          }).start();

          $scope.$on('$destroy', function() {
            vismon.stop();
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

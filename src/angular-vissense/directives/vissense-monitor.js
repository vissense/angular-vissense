(function (angular) {
  angular.module('angular-vissense.directives')

    .directive('vissenseMonitor', ['VisSense', 'VisUtils', '$timeout',
      function (VisSense, VisUtils, $timeout) {

      var d = {
        scope: {
          config: '@',
          onUpdate: '&',
          onHidden: '&',
          onVisible: '&',
          onFullyvisible: '&',
          onPercentagechange: '&',
          onVisibilitychange: '&'
        },
        link: function($scope, $element) {
          $timeout(function() {
            var vismon = new VisSense($element[0], $scope.config).monitor({
              /*visibilitychange: VisUtils.debounce(function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state().state;
                });
              }, 10)*/
              update: $scope.onUpdate,
              hidden: $scope.onHidden,
              visible: $scope.onVisible,
              fullyvisible: $scope.onFullyvisible,
              percentagechange: $scope.onPercentagechange,
              visibilitychange: $scope.onVisibilitychange
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          });
        }
      };

      return d;
    }])
  ;

})(angular);

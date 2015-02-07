(function (angular) {
  angular.module('angular-vissense.directives')

    .directive('vissenseMonitor', ['VisSense',
      function (VisSense) {

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
          link: function ($scope, $element) {
            var vismon = new VisSense($element[0], $scope.config).monitor({
              update: function (monitor) {
                // $scope.$apply(function(scope) {
                $scope.onUpdate({monitor: monitor});
              },
              hidden: function (monitor) {
                $scope.onHidden({monitor: monitor});
              },
              visible: function (monitor) {
                $scope.onVisible({monitor: monitor});
              },
              fullyvisible: function (monitor) {
                $scope.onFullyvisible({monitor: monitor});
              },
              percentagechange: function (newValue, oldValue, monitor) {
                $scope.onPercentagechange({
                  newValue: newValue,
                  oldValue: oldValue,
                  monitor: monitor
                });
              },
              visibilitychange: function (monitor) {
                $scope.onVisibilitychange({monitor: monitor});
              }
            }).startAsync();

            $scope.$on('$destroy', function () {
              vismon.stop();
            });
          }
        };

        return d;
      }])
  ;

})(angular);

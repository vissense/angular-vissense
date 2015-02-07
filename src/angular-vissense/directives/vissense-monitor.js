(function (angular) {
  angular.module('angular-vissense.directives')

    .directive('vissenseMonitor', ['VisSense', 'VisUtils',
      function (VisSense, VisUtils) {

        var d = {
          scope: {
            monitor: '=?ngModel',
            config: '@',
            onUpdate: '&',
            onHidden: '&',
            onVisible: '&',
            onFullyvisible: '&',
            onPercentagechange: '&',
            onVisibilitychange: '&'
          },
          link: function ($scope, $element) {
            var digest = VisUtils.debounce(function() {
                $scope.$digest();
                $scope.$parent.$digest();
            }, 1000);

            $scope.monitor = new VisSense($element[0], $scope.config).monitor({
              update: function (monitor) {
                $scope.onUpdate({monitor: monitor});

                digest();
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
              $scope.monitor.stop();
            });
          }
        };

        return d;
      }])
  ;

})(angular);

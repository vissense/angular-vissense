(function (angular) {
  angular.module('angular-vissense.directives')

    .directive('vissenseMonitor', ['VisSense', 'VisUtils',
      function (VisSense, VisUtils) {

        var d = {
          scope: {
            monitor: '=?ngModel',
            config: '@',
            onStart: '&',
            onStop: '&',
            onUpdate: '&',
            onHidden: '&',
            onVisible: '&',
            onFullyvisible: '&',
            onPercentagechange: '&',
            onVisibilitychange: '&'
          },
          link: function ($scope, $element) {
            var digest = VisUtils.throttle(function () {
              $scope.$digest();
              $scope.$parent.$digest();
            }, 1000);

            $element.addClass('vissense-monitor');

            $scope.monitor = new VisSense($element[0], $scope.config).monitor({
              start: function (monitor) {
                $scope.onStart({monitor: monitor});
              },
              stop: function (monitor) {
                $scope.onStop({monitor: monitor});
              },
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
              percentagechange: function (monitor, newValue, oldValue) {
                $scope.onPercentagechange({
                  monitor: monitor,
                  newValue: newValue,
                  oldValue: oldValue
                });
              },
              visibilitychange: function (monitor) {
                $scope.onVisibilitychange({monitor: monitor});

                $element.removeClass('vissense-monitor-hidden');
                $element.removeClass('vissense-monitor-fullyvisible');
                $element.removeClass('vissense-monitor-visible');

                if (monitor.state().fullyvisible) {
                  $element.addClass('vissense-monitor-fullyvisible');
                } else if (monitor.state().hidden) {
                  $element.addClass('vissense-monitor-hidden');
                } else {
                  $element.addClass('vissense-monitor-visible');
                }
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

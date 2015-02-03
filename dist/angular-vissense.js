(function (angular) {
  angular.module('angular-vissense.config', [])
      .value('angularVissenseConfig', {
        debug: true
      });

  angular.module('angular-vissense.services', []);
  angular.module('angular-vissense.directives', [
    'angular-vissense.services'
  ]);

  angular.module('angular-vissense.directives.debug', []);

  angular.module('angular-vissense', [
    'angular-vissense.config',
    'angular-vissense.directives',
    'angular-vissense.services'
  ]);

})(angular);

(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissensePercentageTimeTest', ['VisSenseService', function (VisSenseService) {

      var d = {
        scope: {
          elementId: '@vissensePercentageTimeTest',
          timeLimit: '@',
          percentageLimit: '@',
          interval: '@'
        },
        controller: ['$scope', function($scope) {
          var visobj = VisSenseService.fromId($scope.elementId);

          $scope.passed = false;

          visobj.onPercentageTimeTestPassed(function() {
            $scope.$apply(function() {
              $scope.passed = true;
            });
          }, {
            percentageLimit: $scope.percentageLimit || 0.5,
            timeLimit: $scope.timeLimit || 1000,
            interval: $scope.interval || 100
          });
        }],
        template: '<span>' +
          '{{percentageLimit * 100 | number:0}}/{{timeLimit / 1000 | number:0}} test: ' +
          '<span data-ng-style="{ color : passed ? \'green\' : \'red\'}">{{passed}}</span>' +
        '</span>'
      };

      return d;
    }])
    .directive('vissenseFiftyOneTest', [function () {
      var d = {
        scope: {
          elementId: '@vissenseFiftyOneTest'
        },
        template: '<span data-vissense-percentage-time-test="{{elementId}}" ' +
          'data-percentage-limit="0.5" ' +
          'data-time-limit="1000" ' +
          'data-interval="100">' +
        '</span>'
      };

      return d;
    }])

    .directive('vissenseSixtyOneTest', [function () {
      var d = {
        scope: {
          elementId: '@vissenseSixtyOneTest'
        },
        template: '<span data-vissense-percentage-time-test="{{elementId}}" ' +
          'data-percentage-limit="0.6" ' +
          'data-time-limit="1000" ' +
          'data-interval="100">' +
        '</span>'
      };

      return d;
    }])
  ;

})(angular);

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

(function (angular) {
  angular.module('angular-vissense.services')
  .factory('VisSense', ['$window', function($window) {
    return $window.VisSense;
  }])

  .factory('VisSenseService', ['VisSense', function(VisSense) {
    var fromId = function(elementId, config) {
      var elementById = document.getElementById(elementId);
      return new VisSense(elementById, config);
    };

    return {
      fromId: fromId
    };
  }])
  ;

})(angular);

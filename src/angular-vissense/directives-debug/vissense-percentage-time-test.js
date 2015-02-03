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

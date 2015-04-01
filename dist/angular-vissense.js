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

(function (angular) {
  angular.module('angular-vissense.directives.debug')
    .directive('vissenseMetricsInfocard', ['VisSense', 'VisUtils', function (VisSense, VisUtils) {
      if(!VisUtils.isFunction(VisSense.VisMon.Strategy.MetricsStrategy)) {
        throw new Error('Cannot load MetricsStrategy. Is it included?');
      }
      if(!VisUtils.isFunction(VisSense.VisMon.Strategy.MetricsStrategy)) {
        throw new Error('Cannot load MetricsStrategy. Is it included?');
      }

      var d = {
        scope: {
          elementId: '@vissenseMetricsInfocard',
          inactiveAfter: '@',
          hidden: '@'
        },
        controller: ['$scope', '$interval', 'VisSenseService',
          function ($scope, $interval, VisSenseService) {
            $scope.model = {
              inactiveAfter: (parseInt($scope.inactiveAfter, 10) || 30000) - 1
            };

            var visobj = VisSenseService.fromId($scope.elementId, {
              hidden: $scope.hidden
            });

            var strategies = [
              new VisSense.VisMon.Strategy.PollingStrategy({interval: 99}),
              new VisSense.VisMon.Strategy.EventStrategy({debounce: 30}),
              new VisSense.VisMon.Strategy.MetricsStrategy()
            ];

            // support for plugin vissense-user-activity
            if (VisUtils.isFunction(VisSense.VisMon.Strategy.UserActivityStrategy)) {
              var userActivityStrategy = new VisSense.VisMon.Strategy.UserActivityStrategy({
                inactiveAfter: $scope.model.inactiveAfter
              });
              strategies.push(userActivityStrategy);
            }

            var monitor = visobj.monitor({
              strategy: strategies,
              visibilitychange: VisUtils.debounce(function (monitor) {
                $scope.$apply(function () {
                  var state = monitor.state();
                  $scope.code = state.code;
                  $scope.state = state.state;
                });
              }, 0)
            }).start();

            var _update = VisUtils.debounce(function () {
              var metrics = monitor.metrics();
              $scope.$apply(function () {
                $scope.timeHidden = metrics.getMetric('time.hidden').get();
                $scope.timeVisible = metrics.getMetric('time.visible').get();
                $scope.timeFullyVisible = metrics.getMetric('time.fullyvisible').get();
                $scope.timeRelativeVisible = metrics.getMetric('time.relativeVisible').get();
                $scope.duration = metrics.getMetric('time.duration').get();

                $scope.percentage = {
                  current: metrics.getMetric('percentage').get(),
                  max: metrics.getMetric('percentage.max').get(),
                  min: metrics.getMetric('percentage.min').get()
                };
              });
            }, 0);

            var intervalId = $interval(_update, 100);

            $scope.$on('$destroy', function () {
              monitor.stop();
              $interval.cancel(intervalId);
            });

          }],
        template: '\
<style>\
.vissense-metrics-container {\
margin: 0px;\
position: fixed;\
left: 42px;\
bottom: 13px;\
width: 600px;\
height: 200px;\
box-shadow: 1px 1px 1px 2px rgba(99, 99, 99, 0.4);\
z-index: 99999;\
background-color: rgba(242,242,242,0.9);\
}\
.vissense-flexbox {\
display: box;\
display: -webkit-box;\
display: -moz-box;\
box-orient: horizontal;\
-webkit-box-orient: horizontal;\
-moz-box-orient: horizontal;\
}\
.vissense-flexbox .box {\
font-size: 23px;\
padding: 10px;\
width: 150px;\
text-align: center;\
}\
.vissense-flexbox .vissense-box small {\
color: #888;\
}\
</style>\
<div class="vissense-metrics-container">\
<div style="text-align:center">\
<span>state: <span data-ng-style="{ color : code > 0 ? \'green\' : \'red\'}">{{state}}</span></span> | \
<span data-vissense-user-activity data-inactive-after="{{model.inactiveAfter}}"></span>\
</div>\
<div class="vissense-flexbox">\
<div class="box">\
<div>{{timeVisible / 1000 | number:1}}s</div>\
<small>time visible</small>\
</div>\
<div class="box">\
<div>{{timeFullyVisible / 1000 | number:1}}s</div>\
<small>time fullyvisible</small>\
</div>\
<div class="box">\
<div>{{timeHidden * 100 / duration | number:0}}%</div>\
<small>percentage hidden</small>\
</div>\
<div class="box">\
<div>{{timeVisible * 100 / duration | number:0}}%</div>\
<small>percentage visible</small>\
</div>\
</div>\
<div class="vissense-flexbox">\
<div class="box">\
<div>{{timeHidden / 1000 | number:1}}s</div>\
<small>time hidden</small>\
</div>\
<div class="box">\
<div>{{timeRelativeVisible / 1000 | number:1}}s</div>\
<small>time relative</small>\
</div>\
<div class="box">\
<div>{{percentage.min * 100 | number:0}}%</div>\
<small>percentage min</small>\
</div>\
<div class="box">\
<div>{{percentage.max * 100 | number:0}}%</div>\
<small>percentage max</small>\
</div>\
</div>\
</div>'
      };

      return d;
    }])
  ;

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

(function (angular) {
  angular.module('angular-vissense.directives.debug')

    .directive('vissenseState', ['VisSenseService', 'VisUtils', '$timeout',
      function (VisSenseService, VisUtils, $timeout) {

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
              visibilitychange: VisUtils.debounce(function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state().state;
                });
              }, 10)
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          });
        },
        template: '<span>{{state}}</span>'
      };

      return d;
    }])

    .directive('vissenseStateDebug', ['VisSenseService',  'VisUtils', '$timeout',
      function (VisSenseService, VisUtils, $timeout) {
      var d = {
        scope: {
          elementId: '@vissenseStateDebug'
        },
        controller: ['$scope', function($scope) {
          $scope.state = {};
          $timeout(function() {
            var vismon = VisSenseService.fromId($scope.elementId).monitor({
              update: VisUtils.debounce(function(monitor) {
                $scope.$apply(function() {
                  $scope.state = monitor.state();
                });
              }, 10)
            }).start();

            $scope.$on('$destroy', function() {
              vismon.stop();
            });
          });
        }],
        template: '{{ state | json }}'
      };

      return d;
    }])
  ;

})(angular);

(function (angular) {
  angular.module('angular-vissense.directives.debug')
    .directive('vissenseUserActivity', ['VisSense', 'VisUtils', function (VisSense, VisUtils) {
      var d = {
        scope: {
          inactiveAfter: '@',
          debounce: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.active = true;
          $scope.installed = VisUtils.isFunction(VisSense.UserActivity);

          if ($scope.installed) {
            $scope.options = {
              inactiveAfter: parseInt($scope.inactiveAfter, 10) || 30000,
              debounce: parseInt($scope.debounce, 10) || 50,
              update: VisUtils.debounce(function(activityMonitor) {
                $scope.active = activityMonitor.isActive();
                $scope.$digest();
              }, 10)
            };

            var activityMonitor = new VisSense.UserActivity($scope.options).start();
            $scope.$on('$destroy', function () {
              activityMonitor.stop();
            });
          }
        }],
        template: '<span>user active: ' +
        '<span data-ng-style="{ color : active ? \'green\' : \'red\'}">{{active}}</span>' +
        '<span data-ng-if="!installed"> (not installed)</span>' +
        '</span>'
      };

      return d;
    }])
  ;

})(angular);

(function (angular) {
  angular.module('angular-vissense.services')
    .factory('VisSense', ['$window', function ($window) {
      return $window.VisSense;
    }])
    .factory('VisUtils', ['VisSense', function (VisSense) {
      return VisSense.Utils;
    }])
    .factory('VisSenseService', ['VisSense', function (VisSense) {
      var fromId = function (elementId, config) {
        var elementById = angular.element('#' + elementId);

        if (elementById.length < 1 || !elementById[0]) {
          return null;
        }

        return new VisSense(elementById[0], config);
      };
      return {
        fromId: fromId
      };
    }])
  ;

})(angular);

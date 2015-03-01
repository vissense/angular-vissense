(function (angular) {
  angular.module('angular-vissense.directives.debug')
    .directive('vissenseMetricsInfocard', [function () {
      var d = {
        scope: {
          elementId: '@vissenseMetricsInfocard'
        },
        controller: ['$scope', '$interval', 'VisSense', 'VisUtils', 'VisSenseService',
          function($scope, $interval, VisSense, VisUtils, VisSenseService) {

          var visobj = VisSenseService.fromId($scope.elementId, {});

          var metrics = visobj.metrics({
            strategy: new VisSense.VisMon.Strategy.PollingStrategy({ interval:100 })
          }).start();

          var vismon = visobj.monitor({
            visibilitychange: VisUtils.debounce(function(monitor) {
              $scope.$apply(function() {
                var state = monitor.state();
                $scope.code = state.code;
                $scope.state = state.state;
              });
            }, 0)
          }).start();

          var _update = VisUtils.debounce(function() {
            $scope.$apply(function() {
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

          var intervalId = $interval(_update, 200);

          $scope.$on('$destroy', function() {
            metrics.stop();
            vismon.stop();
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
<span data-vissense-user-activity></span>\
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

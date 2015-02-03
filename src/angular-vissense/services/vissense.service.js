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

    var startMonitorAsync = function (monitor) {
      setTimeout(function() {
        monitor.start();
      }, 1);
    };

    return {
      fromId: fromId,
      startMonitorAsync: startMonitorAsync
    };
  }])
  ;

})(angular);

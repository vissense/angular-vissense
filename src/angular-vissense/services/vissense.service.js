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

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

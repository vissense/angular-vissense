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

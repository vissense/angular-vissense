'use strict';

describe('VisSenseService', function () {

  var VisSenseService;

  beforeEach(module('angular-vissense'));

  beforeEach(function () {
    inject(function ($injector) {
      VisSenseService = $injector.get('VisSenseService');
    });
  });

  it('should add a service named "VisSenseService"', function () {
    should.exist(VisSenseService);
  });

  describe('method fromId', function () {
    var element;
    var outerScope;

    beforeEach(inject(function ($rootScope, $compile) {
      outerScope = $rootScope.$new();

      element = angular.element('<div id="myElement">foobar</div>');

      $compile(element)(outerScope);

      angular.element('body').append(element);

      outerScope.$digest();
    }));

    it('should get a VisSense object by id', function () {
      var visobj = VisSenseService.fromId('myElement');

      should.exist(visobj);
      should.equal(true, visobj.isVisible());
    });

    it('should return return "null" on non-existing ids', function () {
      var visobj = VisSenseService.fromId('nonExistingId');
      should.equal(null, visobj);
    });

  });

});

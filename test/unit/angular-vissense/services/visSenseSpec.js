'use strict';

describe('VisSense', function () {

  var VisSense;

  beforeEach(module('angular-vissense'));

  beforeEach(function() {
    inject(function($injector) {
      VisSense = $injector.get('VisSense');
    });
  });

  it('should add a service named "VisSense"', function () {
    should.exist(VisSense);
  });

});

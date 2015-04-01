'use strict';

describe('VisUtils', function () {

  var VisUtils;

  beforeEach(module('angular-vissense'));

  beforeEach(function() {
    inject(function($injector) {
      VisUtils = $injector.get('VisUtils');
    });
  });

  it('should add a service named "VisUtils"', function () {
    should.exist(VisUtils);
    should.exist(VisUtils.throttle);
  });

});

'use strict';

describe('vissenseMonitor', function() {
  var element;

  var outerScope;
  var innerScope;

  var template;

  beforeEach(module('angular-vissense'));

  beforeEach(inject(function($rootScope, $compile) {
    outerScope = $rootScope;

    outerScope.monitor = null;
    outerScope.hiddenSpy = sinon.spy();
    outerScope.visibleSpy = sinon.spy();
    outerScope.fullyvisibleSpy = sinon.spy();

    element = angular.element('<div>' +
    '<div vissense-monitor data-ng-model="monitor" ' +
    '  on-hidden="hiddenSpy(monitor)" ' +
    '  on-visible="visibleSpy(monitor)" ' +
    '  on-fullyvisible="fullyvisibleSpy(monitor)">' +
    'This element is {{ monitor.state().state }}!' +
    '</div>' +
    '</div>');

    template = $compile(element)(outerScope);

    innerScope = element.isolateScope();

    outerScope.$digest();
  }));

  it('should bind monitor to ng-model param', function(done) {
    should.exist(outerScope.monitor);
    should.exist(outerScope.monitor.state());
    should.equal(outerScope.monitor.state().state, undefined);

    setTimeout(function() {
      expect(outerScope.monitor.state().state).to.be.a('string');
      expect(outerScope.monitor.state().state).to.equal('hidden');
      done();
    }, 1);
  });

  it('should add class "vissense-monitor"', function() {
    var contents = element.find('div.vissense-monitor');

    contents.should.have.class('vissense-monitor');
  });

  it('should add class "vissense-monitor-hidden"', function(done) {
    var contents = element.find('div.vissense-monitor');

    contents.should.not.have.class('vissense-monitor-hidden');

    setTimeout(function() {
      contents.should.have.class('vissense-monitor-hidden');
      done();
    }, 1);
  });

  it('should call hidden callback', function(done) {

    outerScope.hiddenSpy.should.not.have.been.called;
    outerScope.visibleSpy.should.not.have.been.called;
    outerScope.fullyvisibleSpy.should.not.have.been.called;

    setTimeout(function() {
      expect(outerScope.hiddenSpy.callCount).to.equal(1);

      outerScope.visibleSpy.should.not.have.been.called;
      outerScope.fullyvisibleSpy.should.not.have.been.called;

      done();
    }, 1);
  });

  it('should bind the content', function(done) {
    var contents = element.find('div.vissense-monitor');

    contents.length.should.equal(1);

    contents.text().should.equal('This element is !');

    setTimeout(function() {

      outerScope.$digest();

      contents.text().should.equal('This element is hidden!');

      done();
    }, 1);
  });
});

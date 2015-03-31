'use strict';

describe('vissenseMonitor', function () {
  var element;

  var outerScope;
  var innerScope;

  var template;

  beforeEach(module('angular-vissense'));

  describe('commons', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      outerScope = $rootScope.$new();

      outerScope.monitor = null;
      outerScope.hiddenSpy = sinon.spy();
      outerScope.visibleSpy = sinon.spy();
      outerScope.fullyvisibleSpy = sinon.spy();
      outerScope.updateSpy = sinon.spy();
      outerScope.percentageChangeSpy = sinon.spy();
      outerScope.visibilityChangeSpy = sinon.spy();
      outerScope.startSpy = sinon.spy();
      outerScope.stopSpy = sinon.spy();

      element = angular.element('<div>' +
      '<div vissense-monitor data-ng-model="monitor" ' +
      '  on-start="startSpy(monitor)" ' +
      '  on-stop="stopSpy(monitor)" ' +
      '  on-update="updateSpy(monitor)" ' +
      '  on-visibilitychange="visibilityChangeSpy(monitor)" ' +
      '  on-percentagechange="percentageChangeSpy(monitor)" ' +
      '  on-hidden="hiddenSpy(monitor)" ' +
      '  on-visible="visibleSpy(monitor)" ' +
      '  on-fullyvisible="fullyvisibleSpy(monitor)">' +
      'This element is {{ monitor.state().state }}!' +
      '</div>' +
      '</div>');

      template = $compile(element)(outerScope);

      innerScope = element.scope();

      outerScope.$digest();
    }));

    it('should bind monitor to ng-model param', function (done) {
      should.exist(outerScope.monitor);
      should.exist(outerScope.monitor.state());
      should.equal(outerScope.monitor.state().state, undefined);

      setTimeout(function () {
        expect(outerScope.monitor.state().state).to.be.a('string');
        done();
      }, 1);
    });

    it('should add class "vissense-monitor"', function () {
      var contents = element.find('div.vissense-monitor');

      contents.should.have.class('vissense-monitor');
    });

    it('should invoke passed callbacks', function (done) {
      outerScope.updateSpy.should.not.have.been.called;
      outerScope.startSpy.should.not.have.been.called;

      setTimeout(function () {
        outerScope.startSpy.should.have.been.calledOnce;

        outerScope.updateSpy.should.have.been.called;
        outerScope.visibilityChangeSpy.should.have.been.called;
        outerScope.percentageChangeSpy.should.have.been.called;


        outerScope.stopSpy.should.not.have.been.called;

        innerScope.$destroy();

        outerScope.stopSpy.should.have.been.calledOnce;

        done();

      }, 1);
    });

    it('should bind the content', function (done) {
      var contents = element.find('div.vissense-monitor');

      contents.length.should.equal(1);

      contents.text().should.equal('This element is !');

      setTimeout(function () {

        outerScope.$digest();

        contents.text().should.equal('This element is hidden!');

        done();
      }, 1);
    });
  });

  describe('hidden', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      outerScope = $rootScope.$new();

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

    it('should add class "vissense-monitor-hidden"', function (done) {
      var contents = element.find('div.vissense-monitor');

      contents.should.not.have.class('vissense-monitor-hidden');

      setTimeout(function () {
        contents.should.have.class('vissense-monitor-hidden');
        done();
      }, 1);
    });

    it('should call "hidden" callback', function (done) {
      outerScope.hiddenSpy.should.not.have.been.called;
      outerScope.visibleSpy.should.not.have.been.called;
      outerScope.fullyvisibleSpy.should.not.have.been.called;

      setTimeout(function () {
        expect(outerScope.hiddenSpy.callCount).to.equal(1);

        outerScope.visibleSpy.should.not.have.been.called;
        outerScope.fullyvisibleSpy.should.not.have.been.called;

        done();
      }, 1);
    });
  });


  describe('fullyvisible', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      outerScope = $rootScope.$new();

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

      $('body,html').css('height', '100%');

      // appending the element to body will make it visible
      $('body').append(element);

      template = $compile(element)(outerScope);

      innerScope = element.isolateScope();

      outerScope.$digest();
    }));

    it('should add class "vissense-monitor-fullyvisible"', function (done) {
      var contents = element.find('div.vissense-monitor');

      contents.should.not.have.class('vissense-monitor-fullyvisible');

      setTimeout(function () {
        contents.should.have.class('vissense-monitor-fullyvisible');
        done();
      }, 1);
    });

    it('should call "visible" and "fullyvisible" callback', function (done) {
      outerScope.hiddenSpy.should.not.have.been.called;
      outerScope.visibleSpy.should.not.have.been.called;
      outerScope.fullyvisibleSpy.should.not.have.been.called;

      setTimeout(function () {
        outerScope.hiddenSpy.should.not.have.been.called;

        expect(outerScope.visibleSpy.callCount).to.equal(1);
        expect(outerScope.fullyvisibleSpy.callCount).to.equal(1);

        done();
      }, 1);
    });
  });
});

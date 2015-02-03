'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {
    // Get module
    module = angular.module('angular-vissense');
    dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('angular-vissense.config')).to.be.ok;
  });

  it('should load directives module', function() {
    expect(hasModule('angular-vissense.directives')).to.be.ok;
  });

  it('should load services module', function() {
    expect(hasModule('angular-vissense.services')).to.be.ok;
  });


});

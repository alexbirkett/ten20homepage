/*global describe, it */
'use strict';

describe("partner controller test", function () {
  var ctrl, scope, createController;

  beforeEach(module('ten20Angular'));

  beforeEach(inject(function ($rootScope, $controller) {

    scope = $rootScope.$new();

    createController = function() {
      return $controller('HomeCtrl', {'$scope' : scope});
    };
  }));

  it("controller init correctly", function () {
    createController();
    expect(scope.navs).toBeDefined();
    expect(scope.masterMap).toBeDefined();
  });

});

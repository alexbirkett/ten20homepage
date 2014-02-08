/*global describe, it */
'use strict';

describe("Root controller test", function () {
  var ctrl, scope, createController;

  beforeEach(module('ten20Angular'));

  beforeEach(inject(function ($rootScope, $controller) {

    scope = $rootScope.$new();

    createController = function() {
      return $controller('RootCtrl', {'$scope' : scope});
    };
  }));

  it("controller init correctly", function () {
    createController();
    expect(scope.form).toBeDefined();
    expect(scope.form.contact).toBeDefined();
    expect(scope.form.signin.path).toBe('/signin');
  });

});

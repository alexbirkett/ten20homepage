/*global describe, it */
'use strict';

var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

describe(" admin console test", function () {
  var ctrl, scope, httpMock, createController;

  beforeEach(module('ten20Angular'));

  beforeEach(inject(function ($httpBackend, $http, $rootScope, $controller) {

    httpMock = $httpBackend;

    httpMock.when('GET', '/admin/data').
    respond([{
      "formType": "contact-us",
      "call_me": "false",
      "news_letter": "false",
      "first_name": "test1",
      "last_name": "",
      "phone": "100000",
      "company_name": "Test1 Company",
      "company_website_url": "www.test1.com"
    }]);

    scope = $rootScope.$new();

    createController = function() {
      return $controller('ContactUserCtrl', {'$scope' : scope, $http: $http});
    };
  }));

  it("has filter option attribute", function () {
    var controller = createController();
    createController();
    expect(scope.filterOptions).to.not.be.undefined;
  });

  it("expect data undefined", function () {
    httpMock.expectGET('/admin/data');
    createController();
    expect(scope.userData).to.be.undefined;
  });

  /* for later debug
  it("data attribute phone number correct", function () {
    httpMock.expectGET('/admin/data');
    createController();
    httpMock.flush();
    expect(scope.userData[0].phone).toEqual('100000');
  });
  */
});

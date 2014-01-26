/*global describe, it */
'use strict';

describe("admin console test", function () {
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
      "company_website_url": "www.test1.com",
      "date": "Thu Aug 22 2013"
    }]);

    scope = $rootScope.$new();

    createController = function() {
      return $controller('ContactUserCtrl', {'$scope' : scope, $http: $http});
    };
  }));

  afterEach(function() {
    httpMock.verifyNoOutstandingExpectation();
    httpMock.verifyNoOutstandingRequest();
  });

  it("gets user contact data correctly", function () {
    httpMock.expectGET('/admin/data');
    createController();
    expect(scope.filterOptions).toBeDefined();
    expect(scope.userData).toBeUndefined();
    httpMock.flush();
    expect(scope.userData.length).toBe(1);
    expect(scope.userData[0].phone).toEqual('100000');
    expect(scope.userData[0].first_name).toEqual('test1');
  });

  it("filter user correctly one", function () {
    createController();
    httpMock.flush();
    httpMock.expectGET('/admin/data');
    scope.$apply(function() {
      scope.filterOptions.filterText = 'ten20';
    });
    httpMock.flush();
    expect(scope.userData.length).toBe(0);
  });

  it("filter user correctly two", function () {
    createController();
    httpMock.flush();
    httpMock.expectGET('/admin/data');
    scope.$apply(function() {
      scope.filterOptions.filterText = 'test1';
    });
    httpMock.flush();
    expect(scope.userData.length).toBe(1);
  });

  it("set paging size correctly", function () {
    createController();
    httpMock.flush();
    httpMock.expectGET('/admin/data');
    scope.$apply(function() {
      scope.pagingOptions.pageSize = 20;
    });
    httpMock.flush();
    expect(scope.userData.length).toBe(1);
  });


  it("set current page correctly", function () {
    createController();
    httpMock.flush();
    httpMock.expectGET('/admin/data');
    scope.$apply(function() {
      scope.pagingOptions.currentPage = 2;
    });
    httpMock.flush();
    expect(scope.userData.length).toBe(0);
  });
});

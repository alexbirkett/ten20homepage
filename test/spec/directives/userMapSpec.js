'use strict';

describe('Directive: userMap', function () {

  // load the directive's module and put the partial into templateCache
  beforeEach(module('ten20angular'));

  var element, scope, httpMock;
  var trackerData = {"items":[{"serial":"POS023932","name":"Xiaolei","userId":"52c90f5726fb9b294e337a5a","_id":"52e3214660258d990da1d7a4", "lastMessage": {}},{"_id":"52e3214f60258d990da1d7a5","lastMessage":{"trackerId":"013666666666","type":"locationUpdate","location":{"available":false,"latitude":59.93134,"longitude":10.79079,"speed":"013.8","course":"162.26","millage":"00000000","timestamp":"2014-01-21T20:32:51.558Z"}},"lastUpdate":1390631207361,"location":{"available":false,"latitude":59.93134,"longitude":10.79079,"speed":"013.8","course":"162.26","millage":"00000000","timestamp":"2014-01-21T20:32:51.558Z"},"name":"tk103013666666666","serial":"tk103013666666666","userId":"52c90f5726fb9b294e337a5a"}]};

  var userData = {
    username: 'test',
    email: 'test@ten20.com'
  }

  // load the templates
  beforeEach(module('templates/userConsole.html'));

  // inject http mock
  beforeEach(inject(function ($rootScope, $httpBackend) {
    httpMock = $httpBackend;
    httpMock.whenGET(/user\/info/).respond(userData);
    httpMock.whenGET(/trackers/).respond(trackerData);
    httpMock.whenGET(/images/).respond(200);
    element = angular.element('<div user-console></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    scope = element.children().scope();
  }));

  it('should init correctly', inject(function () {
    // controller variables verification
  }));

  it('map scope initialize correctly', inject(function () {

  }));

});

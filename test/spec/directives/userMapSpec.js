'use strict';

describe('Directive: userMap', function () {

  // load the directive's module and put the partial into templateCache
  beforeEach(module('ten20Angular'));

  var element, scope, httpMock;
  var trackerData = {"items":[{"serial":"POS023932","name":"Xiaolei","userId":"52c90f5726fb9b294e337a5a","_id":"52e3214660258d990da1d7a4", "lastMessage": {}},{"_id":"52e3214f60258d990da1d7a5","lastMessage":{"trackerId":"013666666666","type":"locationUpdate","location":{"available":false,"latitude":59.93134,"longitude":10.79079,"speed":"013.8","course":"162.26","millage":"00000000","timestamp":"2014-01-21T20:32:51.558Z"}},"lastUpdate":1390631207361,"location":{"available":false,"latitude":59.93134,"longitude":10.79079,"speed":"013.8","course":"162.26","millage":"00000000","timestamp":"2014-01-21T20:32:51.558Z"},"name":"tk103013666666666","serial":"tk103013666666666","userId":"52c90f5726fb9b294e337a5a"}]};

  var userData = {
    username: 'test',
    email: 'test@ten20.com'
  }

  // load the templates
  beforeEach(module('LoadTpl'));

  // inject http mock
  beforeEach(inject(function ($rootScope, $httpBackend, $compile) {
    httpMock = $httpBackend;
    httpMock.whenGET(/images/).respond(200);
    element = angular.element('<div user-console></div>');
    $rootScope.trackers = trackerData.items;
    $rootScope.user = userData;
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    scope = element.children().scope();
  }));

  it('root controller should init correctly', inject(function () {
    expect(scope.user).toBeDefined();
    expect(scope.trackers.length).toBe(2);
    expect(scope.toggleMapWidth).toBeDefined();

  }));

  it('tool box should init correctly', inject(function () {
    var toolbox = element.find('.tool-box');
    var panel = element.find('.panel');
    var firstTitle = element.find('.panel-title .first').first(); 
    var toolScope = toolbox.scope();

    expect(toolbox.length).toBe(1);
    expect(panel.length).toBe(2);
    expect(firstTitle.text()).toBe('Xiaolei');

  }));

  it('map scope initialize correctly', inject(function () {
    var map = element.find('#map');
    var usrScope = map.scope();

    expect(map.length).toBe(1);
    expect(usrScope.userMap).toBeDefined();
    expect(usrScope.userMap.map).toBeDefined();
    expect(usrScope.userMap.updateTracker).toBeDefined();

  }));

});

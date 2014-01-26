/*global describe, it */
'use strict';

describe("user controller test", function () {
  var ctrl, msgs, scope, httpMock, createController;

  beforeEach(module('ten20Angular'));

  beforeEach(inject(function ($httpBackend, $http, $rootScope, $controller) {

    httpMock = $httpBackend;
    msgs = [{
      "receivedTime":"2014-01-25T06:26:47.361Z",
      "message":{
        "trackerId":"013666666666",
        "type":"locationUpdate",
        "location": {
          "available":false,
          "latitude":59.93134,
          "longitude":10.79079,
          "speed":"013.8",
          "course":"162.26",
          "millage":"00000000",
          "timestamp":"2014-01-21T20:32:51.558Z"
        }
      },
      "trackerId":"52e3214f60258d990da1d7a5",
      "userId":"52c90f5726fb9b294e337a5a",
      "_id":"52e3592760258d990da1dd4e"
    }];


    httpMock.when('GET', '/user/info').respond({
      "username": "test",
      "email": "test@ten20.com"
    });

    httpMock.when('GET', '/trackers').respond({
      items: [
        {
          "_id": "1",
          "name": "test1"
        }
      ]
    });

    httpMock.when('GET', '/message/notify').respond({
      "_id": "2",
      "name": "test2"
    });

    scope = $rootScope.$new();

    createController = function() {
      return $controller('UserCtrl', {'$scope' : scope, $http: $http});
    };
  }));

  it("controller init correctly", function () {
    createController();

    expect(scope.user).toBeDefined();
    expect(scope.user.email).toBeUndefined();
    expect(scope.trackers.length).toBe(0);

    expect(scope.refreshTracker).toBeDefined();
    expect(scope.recentMsg).toBeDefined();
    expect(scope.showTrip).toBeDefined();
    expect(scope.loadTrips).toBeDefined();
  });

  it("load user and trackers correctly", function () {
    createController();
    httpMock.flush();

    expect(scope.user.email).toBe('test@ten20.com');
    expect(scope.trackers.length).toBe(2);
    expect(scope.trackers[0].name).toBe('test1');
    expect(scope.trackerLoaded).toBe(true);
  });

  it("get notify msg correctly", function () {
    createController();
    httpMock.flush();

    expect(scope.trackers.length).toBe(2);
  });

  it("load recent msg correctly", function () {
    createController();
    httpMock.flush();

    expect(scope.trackers[0].recent).toBeUndefined();

    httpMock.expect('GET', /recent_messages/).respond({items: msgs});
    scope.refreshTracker(scope.trackers[0]);
    httpMock.flush();

    expect(scope.activeTracker._id).toBe('1');
    expect(scope.activeTracker.recent.msgs).toBeDefined();
    expect(scope.activeTracker.recent.msgs.length).toBe(1);

  });

  it("load trip correctly", function () {
    createController();
    httpMock.flush();
    httpMock.when('GET', /trips/).respond({
      items: [ { messages:msgs }]
    });

    expect(scope.trackers[0].trips).toBeUndefined();

    scope.loadTrips(scope.trackers[0]);
    httpMock.flush();

    expect(scope.trackers[0].trips).toBeDefined();
    expect(scope.trackers[0].trips.data.length).toBe(3);
  });
});

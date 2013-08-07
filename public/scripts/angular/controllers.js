'use strict';

/* Controllers */

angular.module('ten20Angular.controllers', []).
  controller('SocketCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!'
    });

  }).
  controller('ContactUserCtrl', function ($scope, $http) {

    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: true
    }; 

    $scope.totalServerItems = 0;

    $scope.pagingOptions = {
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1
    };	

    $scope.setPagingData = function(data, page, pageSize){	

      var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.userData = pagedData;
      $scope.totalServerItems = data.length;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
      setTimeout(function () {
        var data;

        if (searchText) {
          var ft = searchText.toLowerCase();
          $http.get('/admin/data').success(function (rsp) {		
            data = rsp.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            $scope.setPagingData(data, page, pageSize);
          });            

        } else {
          $http.get('/admin/data').success(function (rsp) {
            $scope.setPagingData(rsp, page, pageSize);
          });
        }

      }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.gridOptions = {
      data: 'userData',
      enableCellSelection: true,
      enablePaging: true,
      enableRowSelection: true,
      enableColumnResize: true,
      showFooter: true,
      multiSelect: false,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      virtualizationThreshold: 1,
      rowHeight: 30,
      columnDefs: [
        { field: 'first_name', displayName: 'NAME', width: '10%',
          cellTemplate: '<div class="ngCellText">{{row.getProperty(col.field)}} {{row.getProperty("last_name")}}</div>' },
        { field: 'formType', width: '7%', displayName: 'FORM' },
        { field: 'email', width: '20%', displayName: 'EMAIL' },
        { field: 'phone', width: '10%', displayName: 'PHONE' },
        { field: 'call_me', width: '10%', displayName: 'CALLBACK' },
        { field: 'news_letter', width: '10%', displayName: 'NEWSLETTER' },
        { field: 'company_name', width: '10%', displayName: 'COMPANY' },
        { field: 'company_website_url', displayName: 'URL'}
      ]
    };


  }).
  controller('UserCtrl', function ($scope) {
    $scope.user = {
      id: "51f8cd02fb08a80618000001",
      first_name: "Daniel",
      timeWeather: "oslo cloudy -5.C wed jan 23 21:23",
      trackers: [
        {
          index: "one",
          status: "active",
          serialNum: "2384390",
          location: {
            city: "San Francisco",
            date: "Wed, July 23",
            time: "19:35",
            weather: "cloudy"
          },
          current: {
            fence: "ON 6 km",
            actTime: "Today 18:45",
            elevation: "3 km",
            speed: "7 km"
          },
          history: {
            date: "12 December 2012",
            data: [
              {
                time: "09:00",
                geodata: []
              },
              {
                time: "10:00",
                geodata: []
              },
              {
                time: "11:00",
                geodata: []
              },
              {
                time: "12:00",
                geodata: []
              },
              {
                time: "13:00",
                geodata: []
              }
            ]
          }
        },
        {
          index: "two",
          serialNum: "2384391",
          location: {
            city: "San Francisco",
            date: "Wed, July 23",
            time: "19:35",
            weather: "cloudy"
          },
          current: {
            fence: "ON 6 km",
            actTime: "Today 18:45",
            elevation: "3 km",
            speed: "7 km"
          },
          history: {
            date: "12 December 2012",
            data: [
              {
                time: "09:00",
                geodata: []
              },
              {
                time: "10:00",
                geodata: []
              },
              {
                time: "11:00",
                geodata: []
              },
              {
                time: "12:00",
                geodata: []
              },
              {
                time: "13:00",
                geodata: []
              }
            ]
          }
        },
        {
          index: "three",
          serialNum: "2384392",
          location: {
            city: "San Francisco",
            date: "Wed, July 23",
            time: "19:35",
            weather: "cloudy"
          },
          current: {
            fence: "ON 6 km",
            actTime: "Today 18:45",
            elevation: "3 km",
            speed: "7 km"
          },
          history: {
            date: "12 December 2012",
            data: [
              {
                time: "09:00",
                geodata: []
              },
              {
                time: "10:00",
                geodata: []
              },
              {
                time: "11:00",
                geodata: []
              },
              {
                time: "12:00",
                geodata: []
              },
              {
                time: "13:00",
                geodata: []
              }
            ]
          }
        }
      ]
      
    };

  });

function SocketCtrl($scope, socket) {

  // Socket listeners
  // ================
  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });


  // Private helpers
  // ===============

  var changeName = function (oldName, newName) {
    // rename user in list of users
    var i;
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] === oldName) {
        $scope.users[i] = newName;
      }
    }

    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + oldName + ' is now known as ' + newName + '.'
    });
  }

  // Methods published to the scope
  // ==============================

  $scope.changeName = function () {
    socket.emit('change:name', {
      name: $scope.newName
    }, function (result) {
      if (!result) {
        alert('There was an error changing your name');
      } else {

        changeName($scope.name, $scope.newName);

        $scope.name = $scope.newName;
        $scope.newName = '';
      }
    });
  };

  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });

    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });

    // clear message box
    $scope.message = '';
  };
}

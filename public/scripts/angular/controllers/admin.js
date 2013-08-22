'use strict';

/* admin console page controller */
angular.module('ten20Angular.controllers', []).
  controller('ContactUserCtrl', function ($scope, $http, $timeout) {

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

    $scope.error = '';

    $scope.setPagingData = function(data, page, pageSize){	

      var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.userData = pagedData;
      $scope.totalServerItems = data.length;
      $(window).resize();
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
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

    };

    $scope.$on('delete', function(event, id) {

      $http.post('/admin/data', {id: id}).success(function(res) {
        if (res.error === '') {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        } else {
          $scope.error = res.error;
          $timeout(function() { $scope.error = ''; }, 2000);
        }
      }).error(function(data, status, headers, config) {
        if (status) {
          $scope.error = data.description;
        } else {
          $scope.error = 'connection timeout!';
        }
        $timeout(function() { $scope.error = ''; }, 2000);
      });
    });


    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
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
        { field: 'email', width: '12%', displayName: 'EMAIL' },
        { field: 'phone', width: '10%', displayName: 'PHONE' },
        { field: 'call_me', width: '10%', displayName: 'CALLBACK' },
        { field: 'news_letter', width: '5%', displayName: 'NEWSLETTER' },
        { field: 'company_name', width: '10%', displayName: 'COMPANY' },
        { field: 'company_website_url', width: '15%', displayName: 'URL'},
        { field: 'date', width: '12%', displayName: 'DATE'},
        { displayName: 'OPTIONS', width: '8%', cellTemplate: '<input type="button" ng-click="$emit(\'delete\', row.entity._id)" name="delete" value="Delete">' }

      ]
    };


  });


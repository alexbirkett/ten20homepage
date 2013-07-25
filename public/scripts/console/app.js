'use strict';

var app = angular.module('adminConsole', ['ngGrid']);

app.controller('ContactUserCtrl', function($scope, $http) {

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
    console.log(pagedData);
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
    enablePaging: true,
    showFooter: true,
    multiSelect: false,
    totalServerItems: 'totalServerItems',
    pagingOptions: $scope.pagingOptions,
    filterOptions: $scope.filterOptions,
    columnDefs: [
      { field: 'first_name + last_name', displayName: 'Name' },
      { field: 'formType', displayName: 'Form' },
      { field: 'email', displayName: 'Email' },
      { field: 'phone', displayName: 'Phone' },
      { field: 'call_me', displayName: 'CallBack' },
      { field: 'news_letter', displayName: 'NewsLetter' },
      { field: 'company_name', displayName: 'Company' },
      { field: 'company_website_url', displayName: 'URL'}
    ]
  };

});

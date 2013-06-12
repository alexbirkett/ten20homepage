'use strict';

/* Controllers */

function FrontPageCtrl($scope, $http, $window) {
  $http({method: 'GET', url: '/data/model.json'}).
    success(function(data, status, headers, config) {
      $scope.data = data;
      $scope.window = $window;

      var mapParam = data.sections[1].map;
      var map = $scope.window.L.mapbox.map('map', 'alexbirkett.map-t0fodlre', {zoomControl:false});
      map.setView([mapParam.lat, mapParam.lng], mapParam.zoomLevel);

      // disable user activities on map
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();

      // add circles
      var circleOption = {
        stroke: true,
        weight: 5,
        color: '#eee',
        fillColor: '#f60',
        fillOpacity: 1
      };

      for (var i = 0; i < mapParam.circles.length; i++) {
        var circle= $scope.window.L.circle(mapParam.circles[i], 100, circleOption).addTo(map);
        map.addLayer(circle);
      };

      // add polyline
      var polyOption = {
        stroke: true,
        weight: 2,
        color: '#f60',
      };
      var index = 0;
      var polyLine = $scope.window.L.polyline([], polyOption).addTo(map);

      // animate polylines
      // TODO: change stlye to dotted
      $scope.window.setInterval(function() {
        index++;
        if (index == mapParam.polyLine.length) {
          polyLine.spliceLatLngs(0, index);
          index = 0;
          return;
        }
        polyLine.addLatLng(mapParam.polyLine[index]);
      }, 700);

    }).
    error(function(data, status, headers, config) {
      $scope.data = 'Error!'
    });
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

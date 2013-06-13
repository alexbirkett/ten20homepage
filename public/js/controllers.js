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
        dashArray: '3,4'
      };
      var polyLine = $scope.window.L.polyline([], polyOption).addTo(map);

      var point = $scope.window.L.circle(mapParam.polyLine[0], 100, circleOption).addTo(map);
      twinkleCircle(point);

      // twinkling effects for polyline start point
      function twinkleCircle(circle) {
        var radius = [100, 130, 160, 190, 220, 230, 220, 210, 
                      200,190, 180, 170, 160, 150, 140, 130, 120, 110];
        var index = 0;
        var times = 0;
        var intervalId = $scope.window.setInterval(function() {
            (index == (radius.length - 1))?(index = 0, times++):index++;
            if (times == 3) {
              $scope.window.clearInterval(intervalId); 
              drawPolylines();
              return;
            }
            circle.setRadius(radius[index]);
        }, 100);
      }

      // animate polylines
      function drawPolylines() {
        var index = 0;
        var intervalId = $scope.window.setInterval(function() {
          index++;
          if (index == mapParam.polyLine.length) {
            polyLine.spliceLatLngs(0, index);
            index = 0;
            $scope.window.clearInterval(intervalId); 
            twinkleCircle(point);
            return;
          }
          polyLine.addLatLng(mapParam.polyLine[index]);
        }, 700);
      }



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

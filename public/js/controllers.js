'use strict';

/* Controllers */

function FrontPageCtrl($scope, $http) {
  $http({method: 'GET', url: '/data/model.json'}).
    success(function(data, status, headers, config) {
      $scope.data = data;
      createMap(data.sections[1].map);
      startCarousel();
    }).
    error(function(data, status, headers, config) {
      $scope.data = 'Error!'
    });


  function createMap(mapParam) {
    // circle options
    var circleMarkerOpt = {
      stroke: true,
      weight: 6,
      color: '#eee',
      fillColor: '#f60',
      fillOpacity: 1
    };
    // create map
    var map = L.mapbox.map('map', 'alexbirkett.map-t0fodlre', {zoomControl:false});
    map.setView([mapParam.lat, mapParam.lng], mapParam.zoomLevel);

    // add circles to map
    addCircleMarkers(mapParam.circles);
    // add startpoint
    var startPoint = L.circleMarker(mapParam.polyLine[0], circleMarkerOpt).addTo(map);
    // add polyline
    var polyLine = addPolyline([]);
    // begin twinkle the start point of polyline
    pathEffect();

    function pathEffect() {
      twinkleCircle(startPoint, function() {
        animatePolyline(polyLine, mapParam.polyLine, pathEffect);
      });
    }

    function addPolyline(points) {
      var polyOption = {
        stroke: true,
        weight: 2,
        color: '#f60',
        dashArray: '3,4'
      };
      var polyLine = L.polyline(points, polyOption).addTo(map);
      return polyLine;
    }

    function addCircleMarkers(points) {
      for (var i = 0; i < points.length; i++) {
        var circle= L.circleMarker(points[i], circleMarkerOpt).addTo(map);
        map.addLayer(circle);
      };
    }

    // twinkling effects func for a circle
    function twinkleCircle(circle, callback) {
      var radius = [
            10, 13, 16, 19,
            22, 21, 20, 19,
            18, 17, 16, 15,
            14, 13, 12, 11];
      var index = 0;
      var twinkleTimes = 0;
      var maxTime = 3;

      var intervalId = setInterval(function() {
        if (index == (radius.length - 1)) {
          index = 0;
          twinkleTimes++;
        } else {
          index++;
        }

        // when twinkled max time, stop
        if (twinkleTimes == maxTime) {
          clearInterval(intervalId); 
          callback();
        } else {
          circle.setRadius(radius[index]);
        }
      }, 100);
    }

    // animate polylines func
    function animatePolyline(polyLine, pointArr, callback) {
      var index = 0;
      var intervalId = setInterval(function() {
        index++;

        if (index == pointArr.length) {
          polyLine.spliceLatLngs(0, index);
          index = 0;
          clearInterval(intervalId);
          callback();
        } else {
          polyLine.addLatLng(pointArr[index]);
        }
      }, 700);
    }

  }

  function startCarousel() {
    $(function(){
      $('.carousel').carousel();
    });
  }

}


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

    var markers = addMarkers();
    setInterval(function() {
       updateMarkers();
    }, 1000);

    function randomBetween(min, max) {
      return (Math.random()*(max - min))+min;
    };

    function getRandomVisibleLatLng() {
        var bounds = map.getBounds();
        var lat = randomBetween(bounds.getNorth(), bounds.getSouth());
        var lng = randomBetween(bounds.getWest(), bounds.getEast());
        return [lat,lng];
    };

    function pathEffect() {
      twinkleCircle(startPoint, function() {
        animatePolyline(polyLine, mapParam.polyLine, pathEffect);
      });
    }

    function addPolyline(latlng) {
      var polyOption = {
        stroke: true,
        weight: 2,
        color: '#f60',
        dashArray: '3,4',
          smoothFactor: 0
      };
      var polyLine = L.polyline([latlng], polyOption).addTo(map);
      return polyLine;
    }

    function addMarkers() {
      var markers = [];
      for (var i = 0; i < mapParam.numberOfTrackers; i++) {
        var latlng = getRandomVisibleLatLng();
        var marker = L.circleMarker(latlng, circleMarkerOpt).addTo(map);

        marker.history = addPolyline(latlng);

        map.addLayer(marker);
        markers.push(marker);
      };
      return markers;
    }

    function getDelta(delta) {
        var random;
        if (delta === undefined) {
            random = randomBetween(-0.001, 0.001);// (Math.random() - 0.5) * 2 / 1000;
        } else {
            random = delta + randomBetween(-0.0005, 0.0005);
        }
        return random;
    };

    function moveMarker(marker) {
        var latLng = marker.getLatLng();

        marker.latDelta = getDelta(marker.latDelta);
        marker.lngDelta = getDelta(marker.lngDelta);

        marker.setLatLng([latLng.lat + marker.latDelta, latLng.lng +  marker.lngDelta]);

    }

    function updateHistory(marker) {
        var latlngs = marker.history.getLatLngs();

        latlngs.push(marker.getLatLng());

        if (latlngs.length > 100) {
            latlngs.shift();
        }
        marker.history.setLatLngs(latlngs);

    }

    function updateMarkers() {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            moveMarker(marker);
            updateHistory(marker);
        }
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


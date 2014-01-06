/* defines the basice prototype of map class */
(function() {
  'use strict';
  window.ten20 = window.ten20 || {};

  window.ten20.createMapProto = function () {

    function Map(mapDiv, param) {
      this.mapDiv = mapDiv;
      // copy parameters to this object
      for(var k in param) {
        this[k]=param[k];
      }
      this.markers = [];

      this.init();
    }

    // circle options
    Map.prototype.circleMarkerOpt = {
      stroke: true,
      weight: 6,
      color: '#eee',
      fillColor: '#f60',
      fillOpacity: 1
    };
    // user map or home page map
    Map.prototype.getMapType = function () {
      // override in children class
      return '';
    };

    Map.prototype.init = function() {
      var self = this;
      var tileLayers = {};

      // config mapbox
      L.mapbox.config.HTTPS_URLS = [ 'https://dnv9my2eseobd.cloudfront.net/v3/' ];
      L.mapbox.config.FORCE_HTTPS = true;
      // create map
      this.map = L.mapbox.map(this.mapDiv, this.tile, { zoomControl: this.zoomControl});
      // add layers to map
      if(this.layers) {
        for (var i = 0; i < this.layers.length; i++) {
          var layer = this.layers[i];
          tileLayers[layer.label] = L.mapbox.tileLayer(layer.tileLayer);
        }
        L.control.layers(tileLayers).addTo(this.map);
      }
      // set map geometry
      this.map.setView([this.lat, this.lng], this.zoomLevel);
      this.map.scrollWheelZoom.disable();

      // disable dragging on touch devices and user dashboard
      if ('ontouchstart' in document.documentElement ||
          this.getMapType === 'UserMap') {
        this.map.dragging.disable();
      }

      this.afterInit();
    };

    Map.prototype.afterInit = function() {
      // override in children class
    };

    Map.prototype.getMapObject= function() {
      return this.map;
    };

    Map.prototype.addPolyline = function(latlng) {
      var polyOption = {
        stroke: true,
        weight: 2,
        color: '#f60',
        dashArray: '3,4',
        smoothFactor: 1
      };
      var polyLine = L.polyline(latlng, polyOption).addTo(this.map);
      return polyLine;
    }

    return Map;

  };

  window.ten20.HomeMap = (function () {
    // inherit from Map
    var MapRender = window.ten20.createMapProto();

    var LatlngBound = {
      lat: 0.001,
      lng: 0.005
    };

    var virtualVenceMarkerOuterOpt = {
      stroke: true,
      weight: 1,
      color: '#f60',
      fillColor: '#f60',
      radius:100,
      fillOpacity:0.2
    };

    var virtualVenceMarkerInnerOpt = {
      stroke: false,
      weight: 1,
      fillColor: '#f60',
      fillOpacity: 1,
      radius:2
    };

    MapRender.prototype.getMapType = function () {
      return 'HomeMap';
    };

    MapRender.prototype._getRandomVisibleLatLng = function() {
      var bounds = this.map.getBounds();
      var lat = _randomBetween(bounds.getNorth(), bounds.getSouth());
      var lng = _randomBetween(bounds.getWest(), bounds.getEast());
      return [lat,lng];
    };

    MapRender.prototype.addMarkers = function() {
      for (var i = 0; i < this.numberOfTrackers; i++) {
        var latlng = this._getRandomVisibleLatLng();
        var marker = L.circleMarker(latlng, this.circleMarkerOpt).addTo(this.map);

        if (this.showHistory) {
          var tailer = _preTailer(marker);
          marker.history = this.addPolyline(tailer);
        }

        this.map.addLayer(marker);
        this.markers.push(marker);
      };
    };

    MapRender.prototype.updateNextMarker = function() {
      var self = this;

      if (this.markers.length == 0) {
        return;
      }

      if (this.currentMarkerIndex === undefined ||
          this.currentMarkerIndex === this.markers.length) {
        this.currentMarkerIndex = 0;
      }

      var marker = this.markers[this.currentMarkerIndex];
      _moveMarker(marker, self);
      this.twinkleMarker(marker);
      if (this.showHistory) {
        updateHistory(marker);
      }

      if (this.followFirstTracker && this.markers.length > 0) {
        this.map.panTo(this.markers[0].getLatLng());
      }
      this.currentMarkerIndex++;
    }

    MapRender.prototype.setupVirtualFence = function() {
      if (this.addVirtualFence) {
        var markerPosition = this.map.getCenter();
        L.circleMarker(markerPosition, virtualVenceMarkerOuterOpt).addTo(this.map);
        L.circleMarker(markerPosition, virtualVenceMarkerInnerOpt).addTo(this.map);
      }
    };

    // twinkling effects func for a circle
    MapRender.prototype.twinkleMarker = function(marker) {
      var radius = [
        10, 13, 16, 19,
        22, 21, 20, 19,
        18, 17, 16, 15,
        14, 13, 12, 11];
      var index = 0;

      var intervalId = setInterval(function() {
        if (index == (radius.length - 1)) {
          clearInterval(intervalId);
        } else {
          index++;
        }
        marker.setRadius(radius[index]);
      }, 100);
    };

    // tool functions
    function _randomBetween(min, max) {
      return (Math.random()*(max - min))+min;
    }

    function _getDelta(delta) {
      var random;
      if (delta === undefined) {
        random = _randomBetween(-0.001, 0.001);// (Math.random() - 0.5) * 2 / 1000;
      } else {
        random = delta + _randomBetween(-0.0005, 0.0005);
      }
      return random;
    }

    function _moveMarker(marker, self) {
      var latLng = marker.getLatLng();
      var marginLat, marginLng, deltaLat = 0, deltaLng = 0;

      marker.latDelta = _getDelta(marker.latDelta);
      marker.lngDelta = _getDelta(marker.lngDelta);

      // restrict marker activity in a boundary
      if (self.restrict) {
        marginLat = Math.abs(marker.latDelta + latLng.lat - self.lat);
        marginLng = Math.abs(marker.lngDelta + latLng.lng - self.lng);

        if (marginLat > LatlngBound.lat) {
          if (marker.latDelta + latLng.lat < self.lat - LatlngBound.lat) {
            deltaLat =  marginLat - LatlngBound.lat;
          } else {
            deltaLat = -(marginLat - LatlngBound.lat);
          }
        }

        if (marginLng > LatlngBound.lng) {
          if (marker.lngDelta + latLng.lng < self.lng - LatlngBound.lng) {
            deltaLng =  marginLng - LatlngBound.lng;
          } else {
            deltaLng =  -(marginLng - LatlngBound.lng);
          }
        }
      }

      marker.setLatLng([latLng.lat + marker.latDelta + deltaLat/10,
          latLng.lng + marker.lngDelta + deltaLng/10]);

    }

    function _preTailer(marker) {
      var latlngTail = [];
      var tmpPos = [marker.getLatLng().lat, marker.getLatLng().lng];

      for (var i = 0; i < 20; i++) {
        latlngTail.unshift([tmpPos[0], tmpPos[1]]);
        marker.latDelta = _getDelta(marker.latDelta);
        marker.lngDelta = _getDelta(marker.lngDelta);
        tmpPos[0] += marker.latDelta;
        tmpPos[1] += marker.lngDelta;
      };

      return latlngTail;
    }

    function updateHistory(marker) {
      var latlngs = marker.history.getLatLngs();

      latlngs.push(marker.getLatLng());

      if (latlngs.length > 100) {
        latlngs.shift();
      }
      marker.history.setLatLngs(latlngs);
    }

    MapRender.prototype.afterInit = function (argument) {
      var self = this;

      this.setupVirtualFence();
      this.addMarkers();

      setInterval(function() {
        self.updateNextMarker();
      }, 2000);

      // tweak map control styles
      var layerLabel = $('.leaflet-control-layers-base label');

      // bind click
      layerLabel.on('click', function (e) {

        $(this).parent().children().removeClass('active');
        $(this).addClass('active');

        if ($(this).is(':last-child')) {
          $('.leaflet-control-layers-list').addClass('darker');
        } else {
          $('.leaflet-control-layers-list').removeClass('darker');
        }
      });

      layerLabel.first().click();
    }

    return MapRender;
  })();

  window.ten20.UserMap = (function () {
    // inherit from Map
    var MapRender = window.ten20.createMapProto();

    MapRender.prototype.getMapType = function () {
      return 'UserMap';
    };

    MapRender.prototype.addTracker = function(index, latlng) {
      var marker = L.circleMarker(latlng, this.circleMarkerOpt).addTo(this.map);
      this.map.addLayer(marker);
      this.markers[index] = marker;

    };

    MapRender.prototype.updateTracker = function(index, latlng, pan) {
      var marker = this.markers[index];
      if (marker) {
        marker.setLatLng(latlng);
        if (pan) {
          this.map.panTo(this.markers[index].getLatLng());
        }
      } else {
        this.addTracker(index, latlng);
      }
    };

    MapRender.prototype.addTripHistory = function(index, latlngArr) {
      var marker = this.markers[index];
      marker.history = this.addPolyline(latlngArr);
    };

    MapRender.prototype.updateTripHistory = function(index, latlngArr) {
      var marker = this.markers[index];
      if (marker.history) {
        marker.history.setLatLngs(latlngArr);
      } else {
        this.addTripHistory(index, latlngArr);
      }
    };

    MapRender.prototype.hideTripHistory = function(index) {
      var marker = this.markers[index];

      if (marker.history) {
        marker.history.setLatLngs([]);
      }
    };

    return MapRender;
  })();

})();


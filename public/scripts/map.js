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

     Map.prototype._tweakMapControlStyles = function() {
        // tweak map control styles
        var layerLabel = $('.leaflet-control-layers-base label');

        // bind click
        layerLabel.on('click', function (e) {

            $(this).parent().children().removeClass('active');
            $(this).addClass('active');

            if ($(this).is(':first-child')) {
                $('.leaflet-control-layers-list').addClass('darker');
            } else {
                $('.leaflet-control-layers-list').removeClass('darker');
            }
        });
        layerLabel.first().click();
    }

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

        if (!this.tile) {
            // Add first layer to map
            tileLayers[this.layers[0].label].addTo(this.map);
        }


        L.control.layers(tileLayers).addTo(this.map);
      }
      // set map geometry
      this.map.setView([this.lat, this.lng], this.zoomLevel);
      this.map.scrollWheelZoom.disable();

      // disable dragging on touch devices of homepage
      if ('ontouchstart' in document.documentElement &&
          this.getMapType() === 'HomeMap') {
        this.map.dragging.disable();
      }

      this._tweakMapControlStyles();

      this.afterInit();
    };

    Map.prototype.afterInit = function() {
      // override in children class
    };

    Map.prototype.getMapObject= function() {
      return this.map;
    };

    Map.prototype.addPoint = function(latlng, opts) {
      // circle options
      var pointOpt = {
        stroke: true,
        weight: 5,
        color: '#eee',
        fillColor: '#f60',
        fillOpacity: 1
      };

      for (var key in opts) {
        pointOpt[key] = opts[key];
      };

      return L.circleMarker(latlng, pointOpt).addTo(this.map);
    };

    Map.prototype.addPolyline = function(latlng, opts) {
      var polyOption = {
        stroke: true,
        weight: 2,
        color: '#f60',
        dashArray: '3,4',
        smoothFactor: 1
      };

      for (var key in opts) {
        polyOption[key] = opts[key];
      };

      return L.polyline(latlng, polyOption).addTo(this.map);
    }

      // twinkling effects func for a circle
    Map.prototype.twinkleMarker = function(marker) {
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
        var marker = this.addPoint(latlng)

        if (this.showTail) {
          var tailer = _preTailer(marker);
          marker.tail = this.addPolyline(tailer);
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
      if (this.showTail) {
        _updateTail(marker);
      }

      if (this.followFirstTracker && this.markers.length > 0) {
        this.map.panTo(this.markers[0].getLatLng());
      }
      this.currentMarkerIndex++;
    }

    MapRender.prototype.setupVirtualFence = function() {
      if (this.addVirtualFence) {
        var markerPosition = this.map.getCenter();

        this.addPoint(markerPosition, virtualVenceMarkerOuterOpt);
        this.addPoint(markerPosition, virtualVenceMarkerInnerOpt);
      }
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

    function _updateTail(marker) {
      var latlngs = marker.tail.getLatLngs();

      latlngs.push(marker.getLatLng());

      if (latlngs.length > 100) {
        latlngs.shift();
      }

      marker.tail.setLatLngs(latlngs);
    }

    MapRender.prototype.afterInit = function (argument) {
      var self = this;

      this.setupVirtualFence();
      this.addMarkers();

      setInterval(function() {
        self.updateNextMarker();
      }, 2000);
    }

    return MapRender;
  })();

  window.ten20.UserMap = (function () {
    // inherit from Map
    var MapRender = window.ten20.createMapProto();

    MapRender.prototype.getMapType = function () {
      return 'UserMap';
    };

    MapRender.prototype._addTracker = function(tracker) {
      var latlng = [
        tracker.lastMessage.location.latitude,
        tracker.lastMessage.location.longitude,
      ];

      var opt = {color: '#eee', fillColor: '#f60'}, marker;

      if (tracker.settings) {
        opt.fillColor = '#' + tracker.settings.iconColor;
      }

      marker = this.addPoint(latlng, opt);
      marker.trackerId = tracker._id;

      this.map.addLayer(marker);
      this.markers.push(marker);
      this.map.panTo(marker.getLatLng());

    };

    MapRender.prototype._findMarker = function(tracker) {
      var marker = null;

      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].trackerId === tracker._id) {
          marker = this.markers[i];
          break;
        }
      };

      return marker;
    };

    MapRender.prototype.updateTracker = function(tracker, pan) {
      var marker, location;

      // return if location not available for this tracker
      if (!tracker.lastMessage || !tracker.lastMessage.location) {return;}

      location = tracker.lastMessage.location;
      // find the tracker marker in existing markers
      marker = this._findMarker(tracker);
      // update existing marker location
      if (marker) {
        marker.setLatLng([location.latitude, location.longitude]);
        this.twinkleMarker(marker);
        if (pan) {
          this.map.panTo(marker.getLatLng());
        }
      } else { // new tracker, need to add to map
        this._addTracker(tracker);
      }
    };

    MapRender.prototype._addPath = function(t, fitBounds) {
      var marker = this._findMarker(t);
      var latlngs = [];
      var optsLine = { weight: 2 };
      var optsPoint = { 
        weight: 3, 
        radius: 5,
        color: '#eee',
        fillColor: '#f60'
      };

      if (marker) {
        marker.path = {line:null, points:[]};
        latlngs = _getLineCoordsFromMsg(t.path);
        if (t.settings) {
          optsLine.color = '#' + t.settings.iconColor;
          optsPoint.fillColor= '#' + t.settings.iconColor;
        }
        if (fitBounds) {
          this._clearPaths();
        }
        marker.path.line = this.addPolyline(latlngs, optsLine);
        if (fitBounds) {
          this.map.fitBounds(marker.path.line.getBounds());
        }
        this._addPathPoints(marker.path, t.path, optsPoint);
      }
    };

    // update recent message location to map
    MapRender.prototype.updatePath = function(t, fitBounds) {
      var marker = this._findMarker(t);
      var latlngs = _getLineCoordsFromMsg(t.path);
      var optsPoint = { weight: 3, radius: 5};

      if (latlngs.length === 0) {
        return;
      }
      // pick a point to show marker
      if (!marker) {
        t.lastMessage.location = t.path[0];
        this.updateTracker(t, fitBounds);
        this.updatePath(t, fitBounds);
        return;
      }

      if (marker.path) {
        if (t.settings) {
          optsPoint.color = '#' + t.settings.iconColor;
          optsPoint.fillColor= '#' + t.settings.iconColor;
        }

        if (fitBounds) {
          this._clearPaths();
        }
        marker.path.line.setLatLngs(latlngs);
        if (fitBounds) {
          this.map.fitBounds(marker.path.line.getBounds());
        }
        this._addPathPoints(marker.path, t.path, optsPoint);
      } else {
        this._addPath(t, fitBounds);
      }

    };

    MapRender.prototype._addPathPoints = function(path, msgs, opts) {
      var popup, self;
      
      self = this;

      this._clearPathPoints(path);
      // add msg points
      for (var i = 0; i < msgs.length; i++) {
        if (_comparePixelDist(msgs[i])) {
          _addPoint(msgs[i]);
        }
      }

      function _addPoint(msg) {
        var point = self.addPoint([
              msg.latitude, msg.longitude
            ], opts);

        popup = _generatePopup(msg, opts);
        point.bindPopup(popup, {closeButton: false});
        path.points.push(point);
        _bindEvents(point);
      }

      function _comparePixelDist(msg) {
        var prePoint, current, distPixel;

        if (path.points.length === 0) {
          return true;
        }

        prePoint = self.map.latLngToLayerPoint(
          path.points[path.points.length - 1].getLatLng()
        );
        
        current = self.map.latLngToLayerPoint(
          L.latLng(msg.latitude, msg.longitude)
        );

        distPixel = current.distanceTo(prePoint);

        if (distPixel > 60) {
          return true;
        } else {
          return false;
        }

      }
      
    };

    // only show path for one tracker at a time
    MapRender.prototype._clearPaths = function() {
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].path) {
          if (this.markers[i].path.points) {
            this._clearPathPoints(this.markers[i].path);
          }
          if (this.markers[i].path.line) {
            this.markers[i].path.line.setLatLngs([]);
          }
        }
      };
      
    }
    
    MapRender.prototype._clearPathPoints = function(path) {
      for (var i = 0; i < path.points.length; i++) {
        path.points[i].unbindPopup();
        this.map.removeLayer(path.points[i]);
      };

      path.points = [];
    };

    function _getLineCoordsFromMsg(msgs) {
      var lines = [];

      for (var i = 0; i < msgs.length; i++) {
        lines.push([
            msgs[i].latitude,
            msgs[i].longitude
            ]);
      };

      return lines;
    }

    function _generatePopup(msg, opts) {
      var date = (new Date(msg.timestamp)).toLocaleString();

      return '<p><span class="marker" style="background-color:' +
             opts.fillColor +' "></span>' + '<span>' + date + '</span>';
    }

    function _bindEvents(marker) {
      marker.on('mouseover', deBounce(function() {
        marker.openPopup();
      }, 200));
      marker.on('mouseout', deBounce(function() {
        marker.closePopup();
      }, 200));
    }

    function deBounce(fn, interval) {
      var timerId = null;

      return function(e) {
        clearTimeout(timerId);
        timerId = setTimeout(function() { fn(); timerId = null }, interval);
      };
    }
    
    return MapRender;
  })();

})();


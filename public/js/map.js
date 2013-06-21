window.ten20 = window.ten20 || {};

window.ten20.MapRender = (function () {
    // circle options
    var circleMarkerOpt = {
        stroke: true,
        weight: 6,
        color: '#eee',
        fillColor: '#f60',
        fillOpacity: 1
    };

    var virtualVenceMarkerOuterOpt = {
        stroke: true,
        weight: 1,
        color: '#f60',
        fillColor: '#f60',
        fillOpacity: 1,
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
    
    function MapRender(mapDiv, param) {
      this.mapDiv = mapDiv;

      // copy parameters to this object
      for(var k in param) {
          this[k]=param[k];
      }

      this.markers = [];
      this.polylines = [];
      this.init();
    }

    MapRender.prototype.init = function () {
      // create map
      var self = this;
      this.map = L.mapbox.map(this.mapDiv, this.tile, { zoomControl: this.zoomControl});

      if(this.layers) {
         var layers = {};
         for (var i = 0; i < this.layers.length; i++) {
             var layer = this.layers[i];
             layers[layer.label] = L.mapbox.tileLayer(layer.tileLayer);
         }
         L.control.layers(layers).addTo(this.map);
      }

      this.map.setView([this.lat, this.lng], this.zoomLevel);
      this.map.scrollWheelZoom.disable();
      this.setupVirtualFence();
      this.addMarkers();

      setInterval(function() {
        self.updateNextMarker();
      }, 2000);
    }

    MapRender.prototype._getRandomVisibleLatLng = function() {
        var bounds = this.map.getBounds();
        var lat = randomBetween(bounds.getNorth(), bounds.getSouth());
        var lng = randomBetween(bounds.getWest(), bounds.getEast());
        return [lat,lng];
    };


    MapRender.prototype.getMapObject= function() {
      return this.map;
    }

    MapRender.prototype.addPolyline = function(latlng) {
        var polyOption = {
            stroke: true,
            weight: 2,
            color: '#f60',
            dashArray: '3,4',
            smoothFactor: 0
        };
        var polyLine = L.polyline([latlng], polyOption).addTo(this.map);
        return polyLine;
    }

    MapRender.prototype.addMarkers = function() {
        for (var i = 0; i < this.numberOfTrackers; i++) {
            var latlng = this._getRandomVisibleLatLng();
            var marker = L.circleMarker(latlng, circleMarkerOpt).addTo(this.map);

            if (this.showHistory) {
                marker.history = this.addPolyline(latlng);
            }
            this.map.addLayer(marker);
            this.markers.push(marker);
        };
    }


    MapRender.prototype.updateNextMarker = function() {

        if (this.markers.length == 0) {
          return;
        }
        
        if (this.currentMarkerIndex === undefined || this.currentMarkerIndex === this.markers.length) {
            this.currentMarkerIndex = 0;
        }

        var marker = this.markers[this.currentMarkerIndex];
        moveMarker(marker);
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
    }

    // tool functions
    function randomBetween(min, max) {
        return (Math.random()*(max - min))+min;
    }

    function getDelta(delta) {
        var random;
        if (delta === undefined) {
            random = randomBetween(-0.001, 0.001);// (Math.random() - 0.5) * 2 / 1000;
        } else {
            random = delta + randomBetween(-0.0005, 0.0005);
        }
        return random;
    }

    function moveMarker (marker) {
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

    return MapRender;

})()

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
    
    function MapRender(mapDiv, param) {
      this.mapDiv = mapDiv;
      this.tile = param.tile || 'alexbirkett.map-t0fodlre';
      this.zoomControl = param.zoomControl || false;
      this.lat = param.lat;
      this.lng = param.lng;
      this.zoomLevel = param.zoomLevel;
      this.numberOfTrackers = param.numberOfTrackers;
      this.layers = param.layers;
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

      this.addMarkers();
      setInterval(function() {
        self.updateMarkers();
      }, 1000);
    }

    MapRender.prototype._getRandomVisibleLatLng = function() {
        var bounds = this.map.getBounds();
        var lat = randomBetween(bounds.getNorth(), bounds.getSouth());
        var lng = randomBetween(bounds.getWest(), bounds.getEast());
        return [lat,lng];
    };


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

            marker.history = this.addPolyline(latlng);
            this.map.addLayer(marker);
            this.twinkleMarker(marker);
            this.markers.push(marker);
        };
    }


    MapRender.prototype.updateMarkers = function() {
        for (var i = 0; i < this.markers.length; i++) {
            var marker = this.markers[i];
            moveMarker(marker);
            updateHistory(marker);
        }
    }

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
                index = 0;
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

;
(function() {
  window.L = {
    config: {},
    mapbox: {
      map: function() {
        return {
          setView: function(){},
          scrollWheelZoom: {
            disable: function() {}
          },
          dragging: {
            disable: function() {}
          },
          getBounds: function() {},
          addLayer: function() {},
          panTo: function() {},
          on: function() {},
          fitBounds: function() {},
          latLngToLayerPoint: function() {}
        };
      },
      tileLayer: function() {
        return {
          addTo: function() {}
        };
      },
      config: {}
    },
    control: {
      layers: function () {
        return {
          addTo: function() {},
          on: function() {}
        };
      }
    },
    circleMarker: function() {
      return {
        addTo: function() {},
        on: function() {},
        setRadius: function() {},
        getLatLng: function() {},
        bindPopup: function() {}
      };
    },
    polyLine: function() {
      return {
        on: function() {},
        addTo: function() {},
        setLatLngs: function() {}
      };
    },
    latLng: function() {}
  };
})()

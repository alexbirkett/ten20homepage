'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('HomeCtrl', function ($scope) {
    $scope.navs = [
      {
        "text": "Supported hardware",
        "link": "/#supported",
        "scroll": "true"
      },
      {
        "text": "Plans",
        "link": "/#plans",
        "scroll": "true"
      },
      {
        "text": "Partner program",
        "link": "/partner",
        "scroll": "false"
      },
      {
        "modal": true,
        "id": "contact",
        "text": "Contact Us"
      },
      {
        "modal": true,
        "hidden": true,
        "id": "signin",
        "text": "sign in"
      },
      {
        "text": "About Us",
        "link": "#about-us",
        "scroll": "true"
      }
      /*
      {
        "text": "FAQ",
        "link": "/#faq",
        "scroll": "true"
      }
      */
    ];

    // slides data 
    $scope.slides = [
      {
        "title": "GOTOP TL-206",
        "image": "/images/GPS-tracker-2.png",
        "text": "Portable GPS tracker from GOTOP Limited",
        "link": "http://gotop.cc/index.php/product/Personal%20GPS%20tracker%20TL-206.html"
      },
      {
        "title": "Xenun TK201-2",
      "image": "/images/GPS-tracker-1.png",
      "text": "Portable GPS tracker from Xenun",
      "link": "http://www.gpstrackerchina.com/p107/GPS-Portable-Tracker-TK201-2/"
      },
      {
        "title": "GOTOP TL-201",
      "image": "/images/GPS-tracker-3.png",
      "text": "Portable GPS tracker from GOTOP Limited",
      "link": "http://www.gotop.cc/index.php/product/Personal%20GPS%20tracker%20TL-201.html"
      }
    ];

    $scope.plans = {
      "title": "- PLANS -",
      "name": "plans",

      "items": [
        {
          "name": "FIRST TRACKER",
          "url": "#free-plan",
          "id": "free",
          "price": "0",
          "data": {
            "type": "free-plan"
          },
          "highlighted": false,
          "features": ["Track one tracking device or phone for free", "Real time location", "Trip history" ]

        },
        {
          "name": "FAMILY",
          "url": "#family-plan",
          "id": "family",
          "price": "20",
          "data": {
            "type": "family-plan"
          },
          "highlighted": true,
          "features": ["Our most popular plan", "Real time location", "Trip history", "Virtual fence", "Up to five trackers and phones on the map simultaneously", "Login for each family member", "Warm feeling that you're supporting ten20"]
        },
        {
          "name": "ENTERPRISE",
          "id": "enterprise",
          "url": "#enterprise-plan",
          "price": "50",
          "data": {
            "type": "enterprise-plan"
          },
          "highlighted": false,
          "features": ["Great for fleet tracking", "Telephone support", "Real time location", "Trip history", "Virtual fence", "Unlimited number of trackers", "10 logins", "Warm feeling that you're supporting ten20"]
        }
      ]
    };

    $scope.masterHead = {
      "title": "Track the location of people and things", 
      "subTitle": "Supports GPS trackers and mobile apps",
      "buttonText": "get started now",
      "map": {
        "lat": 51.74,
        "lng": -4.55,
        "zoomLevel": 12,
        "numberOfTrackers": 5,
        "zoomControl": true,
        "showTail": true,
        "layers": [
        {"label": "Satellite",  "tileLayer": "alexbirkett.map-t0fodlre"},
        { "label": "Map", "tileLayer": "alexbirkett.map-bugector"}
        ]
      }
    };

    $scope.features = {
      "title": "- KEY FEATURES -",
      "items": [
        {
          "title": "Real time updates",
          "text": "See your trackers move around the map in realtime, no need to refresh the page.",
          "status": "active",
          "map": {
            "lat": 52.80113,
            "lng": -1.63130,
            "zoomLevel": 16,
            "restrict": true,
            "numberOfTrackers": 1,
            "showTail": false,
            "followFirstTracker": true,
            "addVirtualFence": false,
            "tile": "alexbirkett.map-bugector"
          }
        },
        {
          "title": "Trip History",
          "text": "Trip history is stored by Ten20. It's up to you how long you keep your trips for.",
          "map": {
            "lat": 32.062472,
            "lng": 118.778056,
            "zoomLevel": 15,
            "restrict": true,
            "numberOfTrackers": 1,
            "showTail": true,
            "followFirstTracker":true,
            "addVirtualFence": false,
            "tile": "alexbirkett.map-bugector"
          }
        },
        {
          "title": "Set your own ", 
          "subTitle": "virtual fence",
          "text": "Get alerts via SMS, email, Facebook or Twitter when tracker enters an area you draw on the map.",
          "map": {
            "lat": 59.93245,
            "lng": 10.79090,
            "zoomLevel": 13,
            "restrict": true,
            "numberOfTrackers": 0,
            "showTail": false,
            "followFirstTracker": false,
            "addVirtualFence":true,
            "tile": "alexbirkett.map-bugector"
          }
        }
      ]
    };

});


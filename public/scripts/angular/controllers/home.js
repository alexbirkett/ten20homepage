'use strict';

/* admin console page controller */
angular.module('ten20Angular.controllers').
  controller('HomeCtrl', function ($scope) {
    // form data model
    $scope.form = {
      contact: {
        tplUrl: "/templates/contactForm.html",
        method: "POST",
        path: "/contact",
        class: "big",
        data: {
        }
      },
      signin: {
        "tplUrl": "/templates/signinForm.html",
        "method": "POST",
        "path": "/signin",
        "class": "small",
        "redirect": "/console",
        "data": {
        }
      },
      signup: {
        tplUrl: "/templates/signupForm.html",
        method: "POST",
        path: "/signup",
        class: "small",
        redirect: "/console"
      }
      
    };

    $scope.navsHome = [
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

    $scope.about = {
      "type": "about-us",
      "title": "- About us -",
      "description": "ten20 is being built by a team of people with complementary talents from around the world",

      "peoples": [
        {
          "name": "Alex Birkett",
          "title": "Founder",
          "description": "Alex is a software engineer turned entrepreneur. Alex has 12 years professional experience and is assisting XiaoLei with the code.",
          "location": "UK / Norway",
          "image": "https://s.gravatar.com/avatar/541e744d6552b91e24db6691f33b62ed?s=150"
        },
        {
          "name": "Daniel Butler",
          "title": "Creative Advisor",
          "description": "Daniel created the ten20 name, brand profile and steers the creative direction.",
          "location": "UK / Norway",
          "image": "https://s.gravatar.com/avatar/e71d14aaaf14db810d21f13713f623b3?s=150"
        },
        {
          "name": "Liu XiaoLei",
          "title": "Developer",
          "description": "XiaoLei is a a software engineer contracted to work on ten20. We love XiaoLei's talent, attitude and work ethic. XiaoLei is a fan of unix philosophy of simplicity. He is experienced on front-end technologies and the node.js framework.",
          "location": "Nanjing, China",
          "image": "https://s.gravatar.com/avatar/034820503911819b94f9e3e96a6ef8bd?s=150"
        },
        {
          "name": "Lyn Braas",
          "title": "Designer",
          "description": "Lyn is studying Graphic Design at Mediacollege Amsterdam and designed Ten20's location history feature as an intern at Komodo",
          "location": "Amsterdam, the Netherlands",
          "image": "images/people/LynBraas.jpg"
        }


      ]
    };

    $scope.benefits = {
      "name": "benefits",
      "items": [
        {
          "icon": "secure.png",
          "title": "Secure",
          "text": "Uses industry standard encryption techniques. Hosted in Europe. Subject to strict UK data protection laws."
        },
        {
          "icon": "simple.png",
          "title": "Simple",
          "text": "Configuring your GPS tracker can be challenging, we provide simple instructions in plain English. Support available."
        },
        {
          "icon": "universal.png",
          "title": "Universal",
          "text": "Track people and things with inexpensive GPS tracking devices or mobile phones. Support for handheld and vehicle trackers."
        },
        {
          "icon": "trusted.png",
          "title": "Trusted",
          "text": "ten20 (Birkett Enterprise Ltd) has 6 years experience running GPS tracking service with 400,000 registered users."
        }
      ]
    };

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

    $scope.faq = {
      "name": "- FAQ -",
      "items": [
        {
          "title": "What's ten20?",
          "text": "to be add"
        },
        {
          "title": "How to get your tracker?",
          "text": "to be add"
        },
        {
          "title": "How to be a partner?",
          "text": "to be add"
        }
      ]
    };

    $scope.mapSections = {
      "homeMasterHead": {
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
      },

      "partnerMasterHead": {
        "title": "Get 30% commission for referring customers", 
        "subTitle":"You get paid when we get paid",
        "buttonText": "ENROLL NOW",
        "map": {
          "zoomLevel": 6,
          "lat": -24.73685,
          "lng":130.18799,
          "numberOfTrackers": 5,
          "zoomControl": true,
          "showHistory": true,
          "tile": "alexbirkett.map-t0fodlre",
          "layers": [
            {"label": "Satellite",  "tileLayer": "alexbirkett.map-t0fodlre"},
            { "label": "Map", "tileLayer": "alexbirkett.map-bugector"}
          ]
        }
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
    }

});


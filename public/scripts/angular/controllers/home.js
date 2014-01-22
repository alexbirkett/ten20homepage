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
        tplUrl: "/templates/signinForm.html",
        method: "POST",
        path: "/signin",
        class: "small",
        redirect: "/console",
        data: {
        }
      },
      signup: {
        tplUrl: "/templates/signupForm.html",
        method: "POST",
        path: "/signup",
        class: "small",
        redirect: "/console",
        data: {
          free: {
            type: "free"
          },
          family: {
            type: "family"
          },
          enterprise: {
            type: "enterprise"
          }
        }
      }
      
    };

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

  });


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

  });


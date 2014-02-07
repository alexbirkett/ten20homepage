'use strict';

/* admin console page controller */
angular.module('ten20Angular').
  controller('RootCtrl', function ($scope) {
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
});


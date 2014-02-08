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

  $scope.cookies = "Like most websites Ten20 uses cookies in order to deliver a personalised, responsive service and to improve the site. This is done using simple text files called cookies which sit on your computer. These cookies are completely safe and secure and will never contain any sensitive information.";
});


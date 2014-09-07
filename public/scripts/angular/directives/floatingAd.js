'use strict';

angular.module('ten20Angular').
    directive('floatingAd', function () {
        return {
            templateUrl: 'templates/floatingAd.html',
            restrict: 'A',
            disableCache: true,
            link: function (scope, element, attrs) {
                console.log('link');
            },
            controller: function ($scope, $element, $timeout) {
                console.log($scope);
                $scope.visible = true;

                $scope.hide = function () {
                    $scope.visible = false;
                    $timeout(function () {
                        $scope.visible = true;
                    }, 10 * 60 * 1000);
                }

                $scope.isVisible = function () {
                    console.log($scope.user);
                    return $scope.user && $scope.user._id && $scope.visible;
                }
            }
        };
    });
﻿// Ratings -> http://g00glen00b.be/introduction-angularjs-directives/

var app = angular.module('directives', []);

app.directive('sideMenu', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/side-menu.html',
        controller: 'MainCtrl'
    };
});

app.directive('productDescription', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/product-description.html'
    };
});

app.directive('sellerAvgRating', function () {
    return {
        restrict: 'E',
        scope: {
            reviews: '=reviews',
            max: '=max'
        },
        templateUrl: 'templates/seller-avg-rating.html',
        link: function (scope, elements, attr) {
            scope.totalRating = 0;
            scope.totalReviews = scope.reviews.length;
            scope.average = 0;
            scope.stars = [];
            angular.forEach(scope.reviews, function (value, key) {
                scope.totalRating += value.rating;
            });

            scope.average = Math.ceil(scope.totalRating / scope.totalReviews);

            scope.updateStars = function () {
                var i = 0;
                scope.stars = [];
                for (i = 0; i < scope.max; i += 1) {
                    scope.stars.push({
                        full: scope.average > i
                    });
                }
            };

            scope.starClass = function (star, i) {
                var starClass = 'ion-ios7-star-outline';
                if (star.full || i <= scope.hoverIdx) {
                    starClass = 'ion-ios7-star';
                }
                return starClass;
            };

            scope.$watch('reviews', function (newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                    scope.updateStars();
                }
            });
        }
    };
});

app.directive('itemsLoaded', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            scope.$emit('repeatFinished');
        }
    };
});

app.filter('capitalize', function () {
    return function (input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

app.directive('sellerRating', function () {
    return {
        restrict: 'E',
        scope: {
            rating: '=rating',
            max: '=max'
        },
        templateUrl: 'templates/seller-rating.html',
        link: function (scope, elements, attr) {
            scope.stars = [];

            scope.updateStars = function () {
                var i = 0;
                scope.stars = [];
                for (i = 0; i < scope.max; i += 1) {
                    scope.stars.push({
                        full: scope.rating > i
                    });
                }
            };

            scope.starClass = function (star, i) {
                var starClass = 'ion-ios7-star-outline';
                if (star.full || i <= scope.hoverIdx) {
                    starClass = 'ion-ios7-star';
                }
                return starClass;
            };

            scope.$watch('rating', function (newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                    scope.updateStars();
                }
            });
        }
    };
});

app.directive('productDetails', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/product-details.html'
    };
});

app.directive('productSpecs', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/product-specs.html'
    };
});

app.directive('productTabs', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/product-tabs.html',
        controller: 'MainCtrl'
    };
});

app.directive('productGallery', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/product-gallery.html'
    };
});

app.directive('sellerReviews', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/seller-reviews.html',
        controller: 'MainCtrl'
    };
});
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
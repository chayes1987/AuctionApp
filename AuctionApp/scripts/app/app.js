var app = angular.module('AuctionApp', [
    'ngRoute',
    'ionic',
    'firebase'
]);

app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');

app.config(function ($routeProvider) {
    $routeProvider
    .when('/auctions',
    {
        templateUrl: 'views/auctions.html',
        controller: 'MainCtrl'
    })
    .otherwise({ redirectTo: '/auctions' });
});

app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};

    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions/1"));

    return factory;
}]);

app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', function ($scope, $location, $routeParams, FireBaseService) {
    $scope.items = FireBaseService.items;
}]);

app.controller('ContentCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate', function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);

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
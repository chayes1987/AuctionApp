var app = angular.module('AuctionApp', [
    'directives',
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
    .when('/item/:itemId',
    {
        templateUrl: 'views/item.html',
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
    $scope.loading = true;

    $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
        $scope.loading = false;
    });

    $scope.tab = 1;

    $scope.isSet = function (checkTab) {
        return $scope.tab === checkTab;
    };

    $scope.setTab = function (activeTab) {
        $scope.tab = activeTab;
    };

    if ($routeParams.itemId != undefined) {
        $scope.item = {};
        angular.forEach($scope.items, function (value, index) {
            if (value.$id == $routeParams.itemId) {
                $scope.item = value;
            }
        });
    };
}]);

app.controller('ContentCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate', function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);
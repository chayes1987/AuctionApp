var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ionic',
    'firebase'
]);

app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');
app.constant('WEB_SERVICE_URL', 'http://54.171.120.118:8080/placebidservice/bidder/services/placebid/');

app.config(function ($routeProvider) {
    $routeProvider
    .when('/items',
    {
        templateUrl: 'views/items.html',
        controller: 'MainCtrl'
    })
    .when('/item/:itemId',
    {
        templateUrl: 'views/item.html',
        controller: 'MainCtrl'
    })
    .when('/auction/:auctionid',
    {
        templateUrl: 'views/auction.html',
        controller: 'AuctionCtrl'
    })
    .when('/auctions',
    {
        templateUrl: 'views/auctions.html',
        controller: 'AuctionCtrl'
    })
    .when('/login',
    {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .when('/logout',
    {
        template: 'Logging out...',
        controller: 'LogoutCtrl'
    })
    .otherwise({ redirectTo: '/items' });
});

app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};

    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions"));

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

app.controller('ContentCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate',
    function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);

app.controller('LoginCtrl', ['$scope', '$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($scope, $firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $scope.errors = [];
    // Login
    $scope.login = function () {
        $scope.errors = [];

        if ($scope.userEmail === undefined) {
            $scope.errors.push('Enter Your Email');
            return;
        };

        if ($scope.userPassword === undefined) {
            $scope.errors.push('Enter Your Password');
            return;
        };

        if ($scope.errors.length > 0) {
            return;
        };

        $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$login('password', {
            email: $scope.userEmail,
            password: $scope.userPassword,
            rememberMe: $scope.rememberMe
        }).then(function (user) {
            $rootScope.user = user;
            window.location.href = '#auctions';
        }, function (error) {
            if (error.code === 'INVALID_USER') {
                $scope.errors.push('The Email is invalid');
                return;
            };
            if (error.code === 'INVALID_PASSWORD') {
                $scope.errors.push('The Password is invalid');
                return;
            };
        });
    };
}]);

app.controller('LogoutCtrl', ['$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$logout();
    $rootScope.user = undefined;
    window.location.href = '#items';
}]);

app.controller('AuctionCtrl', ['$scope', '$firebase', '$routeParams', '$http', 'FireBaseService', 'FIREBASE_DB', 'WEB_SERVICE_URL', '$rootScope', function ($scope, $firebase, $routeParams, $http, FireBaseService, FIREBASE_DB, WEB_SERVICE_URL, $rootScope) {
    $scope.auctions = FireBaseService.auctions;

    $scope.placeBid = function () {
        $http.get(WEB_SERVICE_URL + $scope.auction._id + '/' + $rootScope.user.email).
            success(function () {
                alert("Your bid has been placed!");
            }).error(function () {
                alert("Unable to connect to Server...");
            });
    }

    if ($routeParams.auctionid != null) {
        $scope.auction = $firebase(new Firebase(FIREBASE_DB + "auctions/" + $routeParams.auctionid));
    };
}]);
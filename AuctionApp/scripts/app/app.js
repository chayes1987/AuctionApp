/*
    Author - Conor Hayes
*/

/* Create a new Angular Module and inject required dependencies */
var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ionic',
    'firebase'
]);

/* Contants for Firebase root URL and RESTful Web Service address */
app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');
app.constant('WEB_SERVICE_URL', 'http://54.171.120.118:8080/placebidservice/bidder/services/placebid/');

/* RouteProvider - used to route the views */
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

/* Factory - used to retrieve the data from Firebase */
app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};

    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions"));

    return factory;
}]);

/* Main Controller - handles functionality with this controllers scope */
app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', function ($scope, $location, $routeParams, FireBaseService) {
    /* Get the data from the factory */
    $scope.items = FireBaseService.items;
    /* Initialize variables for spinner and current tab */
    $scope.loading = true;
    $scope.tab = 1;

    /* Hides the spinner once the data has been loaded */
    $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
        $scope.loading = false;
    });

    /* Checks to see which tab is active */
    $scope.isSet = function (checkTab) {
        return $scope.tab === checkTab;
    };

    /* Sets the active tab */
    $scope.setTab = function (activeTab) {
        $scope.tab = activeTab;
    };

    /* Sets the current auction item based on ID */
    if ($routeParams.itemId != undefined) {
        $scope.item = {};
        angular.forEach($scope.items, function (value, index) {
            if (value.$id == $routeParams.itemId) {
                $scope.item = value;
            }
        });
    };
}]);

/* Content Controller - handles the side-menu functionality, swipe functionality etc. */
app.controller('ContentCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate',
    function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);

/* Login Controller - handles login functionality, used Firebase SimpleLogin */
app.controller('LoginCtrl', ['$scope', '$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($scope, $firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $scope.errors = [];
    /* Login function */
    $scope.login = function () {
        $scope.errors = [];
        /* Inout validation */
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

        /* Perform login to Firebase */
        $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$login('password', {
            /* Get field values */
            email: $scope.userEmail,
            password: $scope.userPassword,
            rememberMe: $scope.rememberMe
        }).then(function (user) {
            /* Success - set the view to auctions */
            $rootScope.user = user;
            window.location.href = '#auctions';
        }, function (error) {
            /* Failed - Check error code and supply message accordingly */
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

/* Logout Controller - handles logout functionality, uses Firebase SimpleLogin */
app.controller('LogoutCtrl', ['$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$logout();
    /* Clear user variable and reset the view to items */
    $rootScope.user = undefined;
    window.location.href = '#items';
}]);

/* Auction Controller - handles auction functionality */
app.controller('AuctionCtrl', ['$scope', '$firebase', '$routeParams', '$http', 'FireBaseService', 'FIREBASE_DB', 'WEB_SERVICE_URL', '$rootScope', function ($scope, $firebase, $routeParams, $http, FireBaseService, FIREBASE_DB, WEB_SERVICE_URL, $rootScope) {
    /* Get the data from the factory */
    $scope.auctions = FireBaseService.auctions;

    /* Place Bid Function - called to place a bid */
    $scope.placeBid = function () {
        /* Send HTTP GET to the RESTful Web Service and show the response in a message */
        $http.get(WEB_SERVICE_URL + $scope.auction._id + '/' + $rootScope.user.email).
            success(function () {
                alert("Your bid has been placed!");
            }).error(function () {
                alert("Unable to connect to Server...");
            });
    }
    /* Set the current auction based on the ID */
    if ($routeParams.auctionid != null) {
        $scope.auction = $firebase(new Firebase(FIREBASE_DB + "auctions/" + $routeParams.auctionid));
    };
}]);
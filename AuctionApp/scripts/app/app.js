var app = angular.module('AuctionApp', [
    'ionic',
]);

app.controller('ContentCtrl', ['$scope', '$ionicSideMenuDelegate', '$ionicSlideBoxDelegate', function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);
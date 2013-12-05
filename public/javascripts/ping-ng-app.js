Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

var UPDATE_AMOUNT = 5;

var pingApp = angular.module('PingApp', ['ngRoute', 'pingServices'],
    ['$locationProvider', '$routeProvider',
        function($locationProvider, $routeProvider) {
            "use strict";
            $routeProvider.when('/', {
                templateUrl: 'main',
                controller: 'MainCtrl',
                controllerAs: 'main'
            });
            $locationProvider.html5Mode(true);
    }]);

pingApp.controller('MainCtrl', ['$rootScope', 'pingResource', '$scope',
    function($rootScope, pingResource, $scope){
        "use strict";

        // add user to rootscope
        $rootScope.user = pingResource.users.getCurrentUser();
        $scope.user = $rootScope.user;

        // definitions
        $scope.updateAmount = UPDATE_AMOUNT;
        $scope.messages = [];
        $scope.newMessage = '';
        $scope.newFriend = '';
        $scope.friendFailed = false;
        $scope.finishedUpdates = false;

        // Functions
        // Returns the next messages, sets finishedUpdates if fewer updates are returned than requested
        $scope.pushNextMessages = function () {
            pingResource.pings.querySubscribed({
                start : $scope.messages.length,
                size : $scope.updateAmount
            }, function(messages) {
                messages.forEach(function (item) {
                    $scope.messages.push(item);
                });
                if(messages.length < $scope.updateAmount) {
                    $scope.finishedUpdates = true;
                }
            });

        };

        // Sends a message, and adds it to the front of the message queue
        $scope.sendMessage = function () {
            $scope.messages.unshift(pingResource.pings.save({}, { 'message' : $scope.newMessage}));
        };

        $scope.addFriend = function() {

            pingResource.users.updateFriends({}, {'username' : $scope.newFriend},
                function (data) {
                    $scope.friendFailed = false;
                    $scope.user.friends.push(data);
                }, function (err) {
                    $scope.friendFailed = true;
            });
            $scope.newFriend = '';
        }

        $scope.pushNextMessages();
    }]);


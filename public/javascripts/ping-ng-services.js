angular.module('pingServices', ['ngResource'])
    .factory('pingResource', ['$resource', function($resource) {
        return {
            pings : $resource('/api/v1/pings/:suffix', {suffix : null}, {
                querySubscribed : {method : 'GET', params : {suffix : 'subscribed'}, isArray : true },
                save : {method : 'POST'}
            }),
            users : $resource('/api/v1/users/:suffix', {suffix : null}, {
                getCurrentUser : {method : 'GET', params : {suffix : 'current'}},
                updateFriends : {method : 'PUT', params : {suffix : 'current'}}
            })
        }
    }]);
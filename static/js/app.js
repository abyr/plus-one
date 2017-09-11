/*global angular*/
var app = angular.module('App', []);

var init = function() {
    window.initGapi();
};

app.service('sharedProperties', function() {
    var user = {
            id: null
        };

    return {
        getUser: function () {
            return user;
        },
        setUser: function (userObj) {
            user = userObj;
        }
    };
});
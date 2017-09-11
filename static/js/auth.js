/*global angular*/
angular.module('App')
.controller('AuthController', AuthController);

function AuthController($scope, $http, sharedProperties, $window, $rootScope) {
    var ctr = this;
    
    ctr.user = false; 
    ctr.signedIn = false;
    
    $window.initGapi = function () {
        $scope.start();
    };
    
    $scope.start = function () {
        $scope.renderSignInButton();
        return false;
    };
    
    $scope.logout = function () {
        window.gapi.auth.signOut();
    };
    
    this.broadcastUserSignedIn = function (userId) {
        $rootScope.$emit('user-signed_in', userId);  
    };
    
    $scope.processAuth = function (authResult) {
        if (authResult['access_token']) {
            ctr.signedIn = true;
            this.getUserInfo();
        } else if (authResult['error']) {
            ctr.signedIn = false;
        }
    };
    
    $scope.getUserInfo = function () {
        window.gapi.client.load('oauth2', 'v2', function () {
            var request = window.gapi.client.oauth2.userinfo.get();
            
            request.execute(function (resp) {
                sharedProperties.setUser(resp);
                ctr.user = resp;
                ctr.broadcastUserSignedIn(resp.id);
            });
        });
    };
    
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            $scope.processAuth(authResult);
        });
    };
    
    $scope.renderSignInButton = function () {
        !window.gapi && console.error('GAPI is not ready');
        window.gapi && window.gapi.signin.render('signInButton', {
            'callback': $scope.signInCallback,
            'clientid': '443086758021-j3k0j49g9g2fdhnt9pphqn2q4b98c0d6.apps.googleusercontent.com',
            'requestvisibleactions': 'http://schemas.google.com/AddActivity',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
            'cookiepolicy': 'single_host_origin'
        });
        return false;
    };
    
}

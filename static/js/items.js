/*global angular, _*/
angular.module('App')
.controller('ItemsController', ItemsController);

function ItemsController($scope, $http, sharedProperties, $rootScope) {
    var items = [],
        ctr = this;
    
    this.items = items;
    
    $rootScope.$on('user-signed_in', function (evnt, userId) {
        ctr.getItems();
        return false;
    });
    
    this.getItems = function () {
        var userId = this.getUserId();
        
        if (!userId) {
            return false;
        }
        
        $http.get('/api/items', {
            params: {
                userId: userId
            }
        }).then(function (res) {
            ctr.items = res.data;
        }, ctr.errorCallback);
    };
       
    this.getUserId = function () {
        var user = sharedProperties.getUser();
        
        return user.id;
    };
       
    this.saveItem = _.debounce(function (item) {
        $http.put('/api/items/' + item._id, item);
    }, 1000);
    
    this.deleteItem = _.debounce(function (item) {
        $http.delete('/api/items/' + item._id, item).then(function (succ) {
           ctr.getItems();
        }, ctr.errorCallback);
    }, 1000);
    
    this.minus = function (index) {
        var item = ctr.items[index];
        
        item.count--;
        this.saveItem(item);
    };
    
    this.plus = function (index) {
        var item = ctr.items[index];
        
        item.count++;
        this.saveItem(item);
    };
    
    this.zero = function (index) {
        var item = ctr.items[index];
        
        item.count = 0;
        this.saveItem(item);
    };
    this.delete = function (index) {
        var item = ctr.items[index];
        
        item.count = 0;
        this.deleteItem(item);
    };
    
    this.createNew = function () {
        var newItem = $scope.newItem;
        
        newItem.userId = this.getUserId();
        $http.post('create', newItem).then(function (succ) {
           ctr.getItems();
        }, ctr.errorCallback);
    };
    
    this.errorCallback = function (err) {
        console.error(err);
    };
}

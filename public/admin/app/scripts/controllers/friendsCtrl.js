
angular.module('choiso').controller('friendsCtrl', function ($scope, $rootScope, $http, NgTableParams, $window, SweetAlert, $state, $stateParams, $timeout, $http, toaster, User) {

    console.log('== Friends ==');
    
    $scope.user = User.get();
    

});
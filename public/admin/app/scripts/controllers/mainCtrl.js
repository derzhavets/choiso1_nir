
angular.module('choiso').controller('mainCtrl', function ($scope, $rootScope, $state, $http, User) {

    $scope.user = User.get();
    
    $rootScope.$on("userUpdate", function(){
      $scope.user = User.get();
    });
  
    $scope.logout = function(){
        console.log('out');
        
        $http.get('/api/logout').then(function (response) {
            
            User.set(undefined);
            $state.go('login');
           
          }, function (response) {
            User.set(undefined);
            $state.go('login');
            
          });  
        
    };
    
    
});

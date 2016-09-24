
angular.module('choiso').controller('loginCtrl', function ($scope, $rootScope, $http, $state, User) {

    
    $scope.login = function(cred){
        console.log('login');
        $http.post('/api/login', cred).then(function (response) {
            
            console.log(response.data);
            User.set(response.data);
            $state.go('app.dashboard');
           
          }, function (response) {
            console.log('error');
            console.log(response);
          });  
    };

});

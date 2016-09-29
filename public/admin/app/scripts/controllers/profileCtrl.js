
angular.module('choiso').controller('profileCtrl', function (profile, User, $scope, $rootScope, $http, NgTableParams, $window, SweetAlert, $state, $stateParams, $timeout) {

    //init
    $scope.image = undefined;
    $scope.uploadText = 'Change Avatar';
    
    console.log('== Profile ==');
  
    $scope.profile = profile;
    console.log(profile);
    
    $scope.profile.displayName = $scope.profile.firstName + ' ' + $scope.profile.lastName;
  
    // add or edit item
    $scope.updateImage = function(){
        
        $scope.uploading = true;
        User.updateImage($scope.image, function(err, user){
          $scope.uploading = false;
          $scope.uploadText = 'Change Avatar';
          if(err) return $scope.uploadText = 'Something Went Wrong';
          $scope.profile = user;
        
        });
    };
    
    
    $scope.$watch('image', function () {
        
        if($scope.image){
            
            $scope.uploadText = 'Uploading';
            var file = $scope.image;
            var reader  = new FileReader();
            reader.onloadend = function () {
                $scope.profile.avatar = reader.result;
                console.log($scope.item);
                $scope.$apply();
                $scope.updateImage();
            }
            reader.readAsDataURL(file);
        }
        
    });
    
    

});
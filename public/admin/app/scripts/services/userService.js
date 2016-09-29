angular.module('choiso').service('User', function($http, $rootScope, $httpParamSerializer) {

  var user = undefined;
  
  var set = function(data) {
    user = data;
    $rootScope.$emit("userUpdate", {});
  };

  var isLoggedIn = function(){    
    if(user && user._id) return true;
    return false;
  };

  var get = function(){
    if(isLoggedIn()) return user;
    else return false;
    /*
    if(isLoggedIn()) return user;
    return $http.get('/api/users/me').then(function (response) {
        user = response.data;
        return user;
      
      }, function (response) {
        return false;
      });*/
    
  };
  
  var updateImage = function(data, cb){
    
    var formData = new FormData();
    formData.append('avatar', data, data.name);

    $http({
      url: '/api/users/me/update-image',
      method: 'PUT',
      data: formData, 
      headers: {'Content-Type':  undefined}
    }).then(function (response) {
        user = response.data;
        cb(null, user);
      }, function (response) {
        cb(true);
      });
  };
  
  return {
    get: get,
    set: set,
    updateImage : updateImage,
    isLoggedIn : isLoggedIn
  };
});
angular.module('choiso').service('User', function($http) {

  var user = undefined;
  
  var set = function(data) {
    user = data;
  };

  var isLoggedIn = function(){    
    if(user && user._id) return true;
    return false;
  };

  var get = function(){
    if(isLoggedIn()) return user;
    return $http.get('/api/users/me').then(function (response) {
        user = response.data;
        return user;
      
      }, function (response) {
        return false;
      });
  };
  
  var update = function(data, cb){
    $http.put('/api/users/me', data).then(function (response) {
        user = response.data;
        cb(null, user);
      }, function (response) {
        cb(true);
      });
  };
  
  return {
    get: get,
    set: set,
    update : update,
    isLoggedIn : isLoggedIn
  };
});
angular.module('choiso').service('Data', function($http) {

  var appData = undefined;
  
  var set = function(data) {
    appData = data;
  };

  var get = function(){
    if(appData) return appData;
    return $http.get('/api/start').then(function (response) {
        appData = response.data;
        return appData;
      
      }, function (response) {
        return false;
      });
  };
  
  return {
    get: get,
    set: set    
  };
});
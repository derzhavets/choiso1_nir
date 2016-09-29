
angular.module('choiso').controller('communicationsCtrl', function ($scope, $http, Data, toaster, User) {

  $scope.user = User.get();
  $scope.appData = Data.get();
  // list of professions
  $scope.altList = $scope.appData.professions;
  
  function getRequests(){

    $http.get('/api/requests').then(function (response) {
      $scope.requests = response.data;
      console.log($scope.requests);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });

  };
  getRequests();
  
  $scope.addAlt = function(parent, name){
      var flag = false;
      $scope.requests[parent].add = '';
      $scope.requests[parent].alternatives.forEach(function(alt){
        if(alt.name === name) flag = true;
      });
      if(flag) return;
      $scope.requests[parent].alternatives.push({name: name, proviedrId: $scope.user._id});
  };
  
  $scope.removeAlt = function(i, parent){
      $scope.requests[parent].alternatives.splice(i, 1);
  };
  
  $scope.submit = function(i){
      if($scope.requests[i].alternatives.length <= 0) return;
      $scope.requests[i].submitting = true;
    
      $http.put('/api/requests/' + $scope.requests[i]._id, $scope.requests[i]).then(function (response) {
        $scope.requests.splice(i,1);
        toaster.pop('success', "Your Input Has Benn Submmited");
        
      }, function (response) {
        $scope.requests[i].submitting = false;
        toaster.pop('warning', "Something Went Wrong, Please Refresh");
      });
    
  };
  
///
///
});

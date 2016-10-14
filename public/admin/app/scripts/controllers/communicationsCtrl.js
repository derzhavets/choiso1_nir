
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
  
  $scope.addList = function(parent, name){
      var flag = false;
      $scope.requests[parent].add = '';
      $scope.requests[parent].lists.forEach(function(alt){
        if(alt.name === name) flag = true;
      });
      if(flag) return;
      $scope.requests[parent].lists.push({name: name, proviedrId: $scope.user._id});
  };
  
  $scope.addReq = function(parent, i, name){
      
      if(!$scope.requests[parent].from.alternatives[i].reqs) $scope.requests[parent].from.alternatives[i].reqs = [];
      var flag = false;
      $scope.requests[parent].from.alternatives[i].add = '';
      $scope.requests[parent].from.alternatives[i].reqs.forEach(function(alt){
        if(alt.name === name) flag = true;
      });
      if(flag) return;
      $scope.requests[parent].from.alternatives[i].reqs.push({
        parent: $scope.requests[parent].from.alternatives[i].name,
        name: name, 
        providerId: $scope.user._id
      });
  };
  
  $scope.addReqEval = function(grand, parent, i, score){
      console.log(grand,parent,i)
      $scope.requests[grand].from.alternatives[parent].requirements[i].eval = {
        parent: $scope.requests[grand].from.alternatives[parent].requirements[i].name,
        providerId: $scope.user._id,
        score: score
      };
    console.log($scope.requests);
  };
  
  $scope.removeAlt = function(i, parent){
      $scope.requests[parent].alternatives.splice(i, 1);
  };
  $scope.removeList = function(i, parent){
      $scope.requests[parent].lists.splice(i, 1);
  };
  
  $scope.submit = function(alternative,i){
    $scope.requests[i].submitting = true;

    if($scope.requests[i].section === 'requirements'){
      $scope.requests[i].requirements = [];
      $scope.requests[i].from.alternatives.forEach(function(alt){
        if(alt.reqs){
          alt.reqs.forEach(function(req){
            $scope.requests[i].requirements.push(req);
          });
        }
      });
    }
        
    else if($scope.requests[i].section === 'requirements-eval'){
      $scope.requests[i].requirementsEval = [];
      
      var index;
      $scope.requests[i].from.alternatives.forEach(function(alt, idx){
        if(alt.name === alternative) index = idx;
      });
      
      $scope.requests[i].from.alternatives[index].requirements.forEach(function(reqEval){
        if(reqEval.eval) $scope.requests[i].requirementsEval.push(reqEval.eval);
      });
      console.log($scope.requests[i].requirementsEval);
    }
            
    
    console.log($scope.requests[i])
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

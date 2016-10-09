
angular.module('choiso').controller('alternativesCtrl', function ($scope, $rootScope, $http, NgTableParams, $window, SweetAlert, $state, $stateParams, $timeout, $http, toaster, User, Data) {

  
  
  console.log('== Alternative ==');
    
  var titles = {
    main: 'Add And Evaluate Alternatives',
    requestAlternatives : 'Request Alternatives',
    requestRequirements : 'Request Requirements',
    requestRequirementsEval : 'Evaluate Requirements'
  }
  $scope.activeDrag = 'proposal';

  $scope.altRequestArr = [];
  $scope.reqRequestArr = [];
  $scope.reqRequestEvalArr = [];
  $scope.appData = Data.get();
  console.log($scope.appData);

  $scope.user = User.get();
  console.log($scope.user);

  // is "my" requirements" (critical points) page
  $scope.isMyReq = false;

  // chosen alternative
  $scope.alternative = undefined;
  $scope.activeProvider = undefined;

  // list of users professions
  $scope.alts = $scope.user.alternatives;

  // list of professions
  $scope.altList = $scope.appData.professions;

  // list of providers
  $scope.providers = $scope.appData.providers;

  $scope.title = titles.main;

  // list of users dragged
  $scope.contacts = [];

  $scope.selectedAlt = undefined;

  $scope.addAlt = function(selected){
      var selected = selected || $scope.selectedAlt;
      $scope.selectedAlt = undefined;

      var alt = {
          name: typeof selected  === 'string' ? selected : selected.name,
          score: -1,
          attitude: -1,
          traits: []
      };


      $http.post('/api/alternatives', alt).then(function (response) {
          $scope.alts = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });


  };
  
  $scope.addReq = function(selected){
      $scope.selectedReq = undefined;

      var req = {
          name: selected,
          score: 0,
          scores: [],
      };


      $http.post('/api/alternatives/' + $scope.alternative._id + '/requirements' , req).then(function (response) {
          $scope.alternative = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });


  };

  $scope.addContactToRecent = function(selected){
      var selected = selected;

      $http.post('/api/contacts/add-recent/' + selected._id).then(function (response) {
          //$scope.appData.recent[section].list = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });


  };

  $scope.color = function(parent, i, score){
      if(i > score || score === -1) return 'grey';
      if(score < 4) return 'red';
      if(score < 7) return 'orange';
      return 'green';
  };

  $scope.altView = function(alt){
      $scope.alternative = alt;
      console.log(alt.name);
    
      $scope.providers.forEach(function(provider){
        provider.show = false;
        provider.professions.forEach(function(profession){
          if(profession.name === alt.name) provider.show = true;
        })
      })
      $scope.isMyReq = false;
  };

  $scope.back = function(){
      $scope.alternative = undefined;
      $scope.isMyReq = false;
      $scope.askAlternatives = false;
      $scope.askRequirements = false;
      $scope.askRequirementsEval = false;
      $scope.title = titles.main;
      $scope.providers.forEach(function(provider){
        provider.show = true;
      });
  };
  
  $scope.requestAlternativesView = function(){
    
    $http.get('/api/requests/alternatives').then(function (response) {
      $scope.requestedAlternativesArr = response.data;
      $scope.requestedAlternativesArr.forEach(function(item, i){
        $scope.requestedAlternativesArr[i] = item.to;
      });
      
      console.log($scope.requestedAlternativesArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askAlternatives = true;
    $scope.title = titles.requestAlternatives;
  };
  
  $scope.requestRequirementsView = function(){
    
    $http.get('/api/requests/requirements').then(function (response) {
      $scope.requestedRequirementsArr = response.data;
      $scope.requestedRequirementsArr.forEach(function(item, i){
        $scope.requestedRequirementsArr[i] = item.to;
      });
      
      console.log($scope.requestedRequirementsArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askRequirements = true;
    $scope.title = titles.requestRequirements;
  };
  
  $scope.requestRequirementsEvalView = function(){
    
    $http.get('/api/requests/requirements-eval').then(function (response) {
      $scope.requestedRequirementsEvalArr = response.data;
      $scope.requestedRequirementsEvalArr.forEach(function(item, i){
        $scope.requestedRequirementsEvalArr[i] = item.to;
      });
      
      console.log($scope.requestedRequirementsEvalArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askRequirementsEval = true;
    $scope.title = titles.requestRequirements;
  };

  $scope.setScore = function(i, score){
      var oldScore = $scope.alts[i].score;
      $scope.alts[i].score = score;

      $http.put('/api/alternatives/' + $scope.alts[i]._id , $scope.alts[i]).then(function (response) {
          $scope.alts = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
          $scope.alts[i].score = oldScore;
        });
  };
  
  $scope.setReqScore = function(parent, i, req, score){

      req.score = score;
      var oldScore = $scope.alternative.requirements[i].score;
      $scope.alternative.requirements[i].score = score;
    
      $http.put('/api/alternatives/' + $scope.alternative._id + '/requirements/' + req._id + '/scores/' + score)
        .then(function (response) {
          $scope.alternative = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
          $scope.alternative.requirements[i].score = oldScore;
      });
  };

  $scope.setAttitude = function(score){
      var oldScore = $scope.alternative.attitude;
      $scope.alternative.attitude = score;

      $http.put('/api/alternatives/' + $scope.alternative._id , $scope.alternative).then(function (response) {
          response.data.forEach(function(alt){
              if(alt._id == $scope.alternative._id) $scope.alternative = alt;
          });
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
          $scope.alternative.attitude = oldScore;
        });
  };

  $scope.removeAlt = function (i, id) {
      SweetAlert.swal({
          title: "Delete This Item?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it",
          closeOnConfirm: true,
          closeOnCancel: true
      }, function (isConfirm) {
          if (isConfirm) {
              $scope.alts.splice(i, 1);
              $http.delete('/api/alternatives/' + id).then(function (response) {
                  $scope.alts = response.data;
                  setProfAdded();
                }, function (response) {
                  toaster.pop('warning', "Something Went Wrong");
                });
          }
      });
  };
  
  $scope.removeReq = function (i, id) {
      SweetAlert.swal({
          title: "Delete This Item?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it",
          closeOnConfirm: true,
          closeOnCancel: true
      }, function (isConfirm) {
          if (isConfirm) {
              $scope.alternative.requirements.splice(i, 1);
              $http.delete('/api/alternatives/' + $scope.alternative._id + '/requirements/' + id).then(function (response) {
                  $scope.alternative = response.data;
                  setReqAdded();
                }, function (response) {
                  toaster.pop('warning', "Something Went Wrong");
                });
          }
      });
  };

  ////
  ////
  $scope.dropZoneOver = function(){
      $scope.border = true;
  };
  var index = undefined;
  var section = undefined;

  $scope.traitDrop = function(evnet, ui, i){

      console.log('-drop-');
      console.log(i);

      if(i || i === 0) index = i;
      else {
        console.log($scope.alternativeZone);
        $scope.addAlt($scope.alternativeZone.name);
        var items = $scope.activeProvider.professions;
        $scope.alternativeZone = undefined;
        $scope.activeProvider.professions = [];
        $scope.activeProvider.professions = items;
        $scope.activeProvider.professions[index].added = true;
        console.log($scope.activeProvider.professions);
      }

  };
  
  $scope.reqDrop = function(evnet, ui, i, idx){

      console.log('-drop-');
      console.log(i);
      console.log(idx);

      if(i || i === 0) {
        index = i;
        section = idx;
      } else {
        console.log($scope.reqZone);
        $scope.addReq($scope.reqZone.name);
        
        var items = $scope.activeProvider.professions[section].requirements;
        $scope.reqZone = undefined;
        $scope.activeProvider.professions[section].requirements = [];
        $scope.activeProvider.professions[section].requirements = items;
        $scope.activeProvider.professions[section].requirements[index].added = true;
        console.log($scope.activeProvider.professions);
      }

  };

  $scope.enableContactDrag = function(id){
    var flag = true;
     $scope.contacts.forEach(function(contact){
       if(contact._id === id) flag = false;
     });
    return flag;
  };

  $scope.contactDrop = function(evnet, ui, i, idx){

      console.log('-drop-');
      console.log(i);
      console.log(idx);

      if(i || i === 0) {
        index = i;
        section = idx;
      } else {
        console.log(section);
        console.log($scope.contactsZone);
        $scope.addContactToRecent($scope.contactsZone);
        $scope.appData.contacts[2].list.push($scope.contactsZone);
        var items = $scope.appData.contacts[section].list;
        $scope.contactsZone = undefined;
        $scope.appData.contacts[section].list = [];
        $scope.appData.contacts[section].list = items;
        $scope.appData.contacts[section].list[index].added = true;
        
        if($scope.askAlternatives){
          $scope.altRequestArr.push($scope.appData.contacts[section].list[index]);
        }else if($scope.askRequirementsEval){
          $scope.reqRequestEvalArr.push($scope.appData.contacts[section].list[index]);
        } else if($scope.askRequirements) {
          $scope.reqRequestArr.push($scope.appData.contacts[section].list[index]);
        }
        
        console.log($scope.appData.contacts[section].list);
        console.log($scope.altRequestArr);
        console.log($scope.reqRequestArr);
        console.log($scope.reqRequestEvalArr);
      }

  };

  $scope.enableAlternativeDrag = function(name){
    var flag = true;
     $scope.alts.forEach(function(alt){
       if(alt.name === name) flag = false;
     });
    return flag;
  };
  
  $scope.enableRequirementsDrag = function(name){
    var flag = true;
     $scope.alternative.requirements.forEach(function(req){
       if(req.name === name) flag = false;
     });
    return flag;
  };

  $scope.setProvider = function(i){
      $scope.activeProvider = $scope.providers[i];
      setProfAdded();
      setReqAdded();

  };

  function setProfAdded(){
    if($scope.activeProvider && $scope.activeProvider.professions){
      for(var i = 0 ; i < $scope.activeProvider.professions.length ; i++){
        $scope.activeProvider.professions[i].added = !$scope.enableAlternativeDrag($scope.activeProvider.professions[i].name);
      }
    }
  }
  
  function setReqAdded(){
    if($scope.alternative && $scope.activeProvider && $scope.activeProvider.professions){
      for(var i = 0 ; i < $scope.activeProvider.professions.length ; i++){
        for(var k = 0 ; k < $scope.activeProvider.professions[i].requirements.length ; k++){
          $scope.activeProvider.professions[i].requirements[k].added = !$scope.enableRequirementsDrag($scope.activeProvider.professions[i].requirements[k].name);
        }
      }
    }
  }
  
  
  $scope.sendAlternativeRequest = function(show){
    
    if($scope.altRequestArr.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.altRequestArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'alternatives',
        type: 'collect',
        show: show,
        alternatives: []
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestAlternativesView();
        $scope.altRequestArr = [];
      }, function (response) {
        toaster.pop('warning', "Something Went Wrong");
      });
    
  };
  
  $scope.sendRequirementsRequest = function(show){
    
    if($scope.reqRequestArr.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.reqRequestArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'requirements',
        type: 'collect',
        show: show,
        alternatives: []
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestRequirementsView();
        $scope.reqRequestArr = [];
      }, function (response) {
        toaster.pop('warning', "Something Went Wrong");
      });
    
  };
  
  $scope.sendRequirementsEvalRequest = function(show){
    
    if($scope.reqRequestEvalArr.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.reqRequestEvalArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'requirements-eval',
        type: 'evaluate',
        show: show,
        alternatives: [],
        alternative: $scope.alternative.name
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestRequirementsEvalView();
        $scope.reqRequestEvalArr = [];
      }, function (response) {
        toaster.pop('warning', "Something Went Wrong");
      });
    
  };
  
  $scope.getEvalFace = function(id){
    var res;
    $scope.appData.contacts[2].list.forEach(function(contact){
      if(contact._id == id) res = contact.avatar;
    });
    return res;
  };
  $scope.getEvalName = function(id){
    var res;
    $scope.appData.contacts[2].list.forEach(function(contact){
      if(contact._id == id) res = contact.firstName;
    });
    return res;
  };
  
  $scope.setEvalData = function(i,arr){
    
    var data = [0,0,0,0];
    arr.forEach(function(evaluation){
      console.log(evaluation.score);
      if(evaluation.score === -2) data[0]++;
      if(evaluation.score === -1) data[1]++;
      if(evaluation.score === 1) data[2]++;
      if(evaluation.score === 2) data[3]++;
    });
    console.log(data);
    $scope.alternative.requirements[i].evalScores = data;
  };
  
  
  $scope.chart = {
    options: {},
    flag: false,
    labels: ['Awful','Bad','Good','Great'],
    colors: [ '#c62828','#e57373','#81c784','#388e3c'],
    click: function(event){
      
      var label = event[0]._model.label
      var i = parseInt(event[0]._chart.canvas.id.replace('chart',''));
      var score = 0;
      
      if(label === 'Awful') score = -2;
      if(label === 'Bad') score = -1;
      if(label === 'Good') score = 1;
      if(label === 'Great') score = 2;
      
      if($scope.alternative.requirements[i].showScore){
        if($scope.alternative.requirements[i].showScore === score) {
          $scope.alternative.requirements[i].showScore = false;
          $scope.alternative.requirements[i].showScoreFilter = false;
        } else {
          $scope.alternative.requirements[i].showScore = score;
          $scope.alternative.requirements[i].showScoreFilter = true;
        }
        
      } else {
        $scope.alternative.requirements[i].showScore = score;
        $scope.alternative.requirements[i].showScoreFilter = true;
      }
      $scope.$apply();
      console.log($scope.alternative.requirements[i].showScore);
      console.log($scope.alternative.requirements[i].showScoreFilter);
      
    }
  }
  

});
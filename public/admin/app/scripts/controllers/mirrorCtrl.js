
angular.module('choiso').controller('mirrorCtrl', function ($scope, $rootScope, $http, NgTableParams, $window, SweetAlert, $state, $stateParams, $timeout, $http, toaster, User, Data) {

  $scope.mirror = true;
  
  console.log('== Mirror ==');
    
  var titles = {
    main: 'Add And Evaluate Traits',
    requestLists : 'Request Traits',
    requestTraits : 'Request Traits',
    requestTraitsEval : 'Evaluate Requirements'
  }
  $scope.activeDrag = 'proposal';

  $scope.listRequestArr = [];
  $scope.traitRequestArr = [];
  $scope.traitRequestEvalArr = [];
  
  $scope.appData = Data.get();
  console.log($scope.appData);

  $scope.user = User.get();
  console.log($scope.user);

  // chosen alternative
  $scope.alternative = undefined;
  $scope.activeProvider = undefined;

  // list of user lists
  $scope.lists = $scope.user.traits || [];

  // list of professions
  $scope.altList = $scope.appData.professions;

  // list of providers
  $scope.providers = $scope.appData.providers;

  $scope.title = titles.main;

  // list of users dragged
  $scope.contacts = [];

  $scope.selectedList = undefined;

  $scope.addList = function(selected){
      var selected = selected || $scope.selectedList;
      $scope.selectedList = undefined;

      var alt = {
          name: typeof selected  === 'string' ? selected : selected.name,
          attributes: []
      };
      console.log(alt);

      $http.post('/api/mirror', alt).then(function (response) {
          $scope.lists = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });


  };
  
  $scope.addAttribute = function(selected){
      $scope.selectedAttribute = undefined;

      var attribute = {
          name: selected
      };
      console.log(attribute);

      $http.post('/api/traits/' + $scope.alternative._id + '/attributes' , attribute).then(function (response) {
          $scope.alternative = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });
    

  };

  $scope.addContactToRecent = function(selected){
      var selected = selected;

      $http.post('/api/contacts/add-recent/' + selected._id).then(function (response) {
          //$scope.appData.contacts[2].list = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
        });


  };


  $scope.listView = function(list){
    
    $scope.alternative = list;
    console.log(list.name);
    console.log($scope.alternative);
    $scope.providers.forEach(function(provider,i){
      provider.show = false;

      if(provider.attributes){
        provider.attributes.forEach(function(trait,k){
          if(trait.parent === list.name) provider.show = true;
        });
      }

      if(provider.traits){
        provider.traits.forEach(function(trait,k){
          if(trait.listName === list.name) provider.show = true;
          if(trait.attributes){
            trait.attributes.forEach(function(att,l){
              $scope.providers[i].traits[k].attributes[l] = {name: att};
            });
            if(provider.attributes) provider.attributes.push.apply(provider.attributes, trait.attributes);
            else provider.attributes = trait.attributes;
          }
        });
      } 


      console.log(provider);
    });
      
  };

  $scope.back = function(){
      $scope.alternative = undefined;
      $scope.askLists = false;
      $scope.askAttributes = false;
      $scope.askAttributesEval = false;
      $scope.title = titles.main;
      $scope.providers.forEach(function(provider){
        provider.show = true;
      });
  };
  
  $scope.requestListsView = function(){
    
    $http.get('/api/requests/miror').then(function (response) {
      $scope.requestedMirrorArr = response.data;
      $scope.requestedMirrorArr.forEach(function(item, i){
        $scope.requestedMirrorArr[i] = item.to;
      });
      
      console.log($scope.requestedMirrorArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askLists = true;
    $scope.title = titles.requestLists;
  };
  
  $scope.requestAttributesView = function(){
    
    $http.get('/api/requests/attributes').then(function (response) {
      $scope.requestedAttributesArr = response.data;
      $scope.requestedAttributesArr.forEach(function(item, i){
        $scope.requestedAttributesArr[i] = item.to;
      });
      
      console.log($scope.requestedAttributesArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askAttributes = true;
    $scope.title = titles.requestTraits;
  };
  
  $scope.requestAttributesEvalView = function(){
    
    $http.get('/api/requests/attributes-eval').then(function (response) {
      $scope.requestedAttributesEvalArr = response.data;
      $scope.requestedAttributesEvalArr.forEach(function(item, i){
        $scope.requestedAttributesEvalArr[i] = item.to;
      });
      
      console.log($scope.requestedAttributesEvalArr);
    }, function (response) {
      toaster.pop('warning', "Something Went Wrong, Please Refresh");
    });
    
    $scope.askAttributesEval = true;
    $scope.title = titles.requestTraitsEval;
  };

  var checkedAttributes = [];
  $scope.checkAttribue = function(attr){
    var index = checkedAttributes.indexOf(attr);
    if( index > -1)  checkedAttributes.splice(index,1);
    else checkedAttributes.push(attr);
    console.log(checkedAttributes);
  }
  /*
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
  */
  
  
  $scope.setReqScore = function(parent, i, req, score){

      req.score = score;
      var oldScore = $scope.alternative.attributes[i].score;
      $scope.alternative.attributes[i].score = score;
    
      $http.put('/api/traits/' + $scope.alternative._id + '/attributes/' + req._id + '/scores/' + score)
        .then(function (response) {
          $scope.alternative = response.data;
        }, function (response) {
          toaster.pop('warning', "Something Went Wrong");
          $scope.alternative.attributes[i].score = oldScore;
      });
  };

  $scope.removeList = function (i, id) {
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
              $scope.lists.splice(i, 1);
              $http.delete('/api/mirror/' + id).then(function (response) {
                  $scope.lists = response.data;
                  setListsAdded();
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

  $scope.listDrop = function(evnet, ui, i){

      console.log('-drop-');
      console.log(i);

      if(i || i === 0) index = i;
      else {
        console.log($scope.listZone);
        $scope.addList($scope.listZone.listName);
        var items = $scope.activeProvider.traits;
        $scope.listZone = undefined;
        $scope.activeProvider.traits = [];
        $scope.activeProvider.traits = items;
        $scope.activeProvider.traits[index].added = true;
        console.log($scope.activeProvider.traits);
      }

  };
  
  $scope.attributeDrop = function(evnet, ui, i){

      console.log('-drop-');
      console.log(i);

      if(i || i === 0) {
        index = i;
      } else {
        console.log($scope.reqZone);
        $scope.addAttribute($scope.reqZone.name);
        
        var items = $scope.activeProvider.attributes;
        $scope.reqZone = undefined;
        $scope.activeProvider.attributes = [];
        $scope.activeProvider.attributes = items;
        $scope.activeProvider.attributes[index].added = true;
        console.log($scope.activeProvider.attributes);
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
        var flag = true;
        $scope.appData.contacts[2].list.forEach(function(contact){
          if(contact._id === $scope.contactsZone._id) flag = false;
        })
        if(flag) $scope.appData.contacts[2].list.push($scope.contactsZone);
        
        var items = $scope.appData.contacts[section].list;
        $scope.contactsZone = undefined;
        $scope.appData.contacts[section].list = [];
        $scope.appData.contacts[section].list = items;
        $scope.appData.contacts[section].list[index].added = true;
        
        if($scope.askLists){
          $scope.listRequestArr.push($scope.appData.contacts[section].list[index]);
        }else if($scope.askAttributesEval){
          $scope.traitRequestEvalArr.push($scope.appData.contacts[section].list[index]);
        } else if($scope.askAttributes) {
          $scope.traitRequestArr.push($scope.appData.contacts[section].list[index]);
        }
        
        console.log($scope.appData.contacts[section].list);
        console.log($scope.listRequestArr);
        console.log($scope.traitRequestArr);
        console.log($scope.traitRequestEvalArr);
      }

  };

  $scope.enableListDrag = function(name){
    var flag = true;
     $scope.lists.forEach(function(list){
       if(list.name === name) flag = false;
     });
    return flag;
  };
  
  $scope.enableAttriutesDrag = function(name){
    var flag = true;
     $scope.alternative.attributes.forEach(function(atr){
       if(atr.name === name) flag = false;
     });
    return flag;
  };

  $scope.setProvider = function(i){
      $scope.activeProvider = $scope.providers[i];
      setListsAdded();
      setAttributesAdded();

  };

  function setListsAdded(){
    if($scope.activeProvider && $scope.activeProvider.traits){
      for(var i = 0 ; i < $scope.activeProvider.traits.length ; i++){
        $scope.activeProvider.traits[i].added = !$scope.enableListDrag($scope.activeProvider.traits[i].listName);
      }
    }
  }
  
  function setAttributesAdded(){
    if($scope.alternative && $scope.activeProvider && $scope.activeProvider.attributes){
      for(var i = 0 ; i < $scope.activeProvider.attributes.length ; i++){
          $scope.activeProvider.attributes[i].added = !$scope.enableAttriutesDrag($scope.activeProvider.attributes[i].name);
        }
    }
  }
  
  
  $scope.sendListsRequest = function(show){
    
    if($scope.listRequestArr.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.listRequestArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'lists',
        type: 'collect',
        show: show,
        lists: []
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestListsView();
        $scope.listRequestArr = [];
      }, function (response) {
        toaster.pop('warning', "Something Went Wrong");
      });
    
  };
  
  $scope.sendAttributesRequest = function(show){
    
    if($scope.traitRequestArr.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.traitRequestArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'attributes',
        type: 'collect',
        alternative: $scope.alternative.name,
        show: show,
        alternatives: []
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestAttributesView();
        $scope.traitRequestArr = [];
      }, function (response) {
        toaster.pop('warning', "Something Went Wrong");
      });
    
  };

  $scope.sendAttributesEvalRequest = function(show){
    checkedAttributes
    if($scope.traitRequestEvalArr.length <= 0 || checkedAttributes.length <= 0) return;
    $scope.sendingRequest = true;
    
    var arr = [];
    
    $scope.traitRequestEvalArr.forEach(function(to){
      arr.push({
        to: to._id,
        section: 'attributes-eval',
        type: 'evaluate',
        alternatives: [],
        show: show,
        attrEvalList: checkedAttributes,
        alternative: $scope.alternative.name
      });
      
    });

    $http.post('/api/requests', arr).then(function (response) {
        toaster.pop('success', "Requests Sent");
        $scope.requestAttributesEvalView();
        $scope.traitRequestEvalArr = [];
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
    console.log(arr);
    console.log($scope.alternative.name);
    if($scope.alternative.name === 'preferences' || $scope.alternative.name === 'values'){
      var data = [0,0,0,0];
      arr.forEach(function(evaluation){
        console.log(evaluation.score);
        if(evaluation.score === -2) data[0]++;
        if(evaluation.score === -1) data[1]++;
        if(evaluation.score === 1) data[2]++;
        if(evaluation.score === 2) data[3]++;
      });
      if($scope.alternative.name === 'preferences') $scope.chart.labels = ['Hate','Dislike','Like','Love'];
      if($scope.alternative.name === 'values') $scope.chart.labels = ['Insist Not','Prefer Not','Prefer','Insist'];
      $scope.chart.colors = [ '#c62828','#e57373','#81c784','#388e3c'];
    }
    else if($scope.alternative.name === 'strengths' || $scope.alternative.name === 'concerns'){
      var data = [0,0,0];
      arr.forEach(function(evaluation){
        console.log(evaluation.score);
        if(evaluation.score === 1) data[0]++;
        if(evaluation.score === 2) data[1]++;
        if(evaluation.score === 3) data[2]++;
      });
      if($scope.alternative.name === 'strengths') $scope.chart.labels = ['Ok','Good','Great'];
      if($scope.alternative.name === 'concerns') $scope.chart.labels = ['Wish','Need','Must'];
      $scope.chart.colors = [ '#81c784','#388e3c', '#385e3c'];
    }
    else if($scope.alternative.name === 'weaknesses'){
      var data = [0,0,0,0];
      arr.forEach(function(evaluation){
        console.log(evaluation.score);
        if(evaluation.score === -1) data[0]++;
        if(evaluation.score === -2) data[1]++;
        if(evaluation.score === -3) data[2]++;
      });
      $scope.chart.labels = ['Issue','Problem','Disaster'];
      $scope.chart.colors = [ '#e57373','#f54343','#c62828'];
    }
    console.log(data);
    $scope.alternative.attributes[i].evalScores = data;
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
      
      if($scope.alternative.name === 'preferences'){
        if(label === 'Hate') score = -2;
        if(label === 'Dislike') score = -1;
        if(label === 'Like') score = 1;
        if(label === 'Love') score = 2;
      }
      else if($scope.alternative.name === 'strengths'){
        if(label === 'Ok') score = 1;
        if(label === 'Good') score = 2;
        if(label === 'Great') score = 3;
      }
      else if($scope.alternative.name === 'concerns'){
        if(label === 'Wish') score = 1;
        if(label === 'Need') score = 2;
        if(label === 'Must') score = 3;
      }
      else if($scope.alternative.name === 'values'){
        if(label === 'Insist Not') score = -2;
        if(label === 'Prefer Not') score = -1;
        if(label === 'Prefer') score = 1;
        if(label === 'Insist') score = 1;
      }
      else if($scope.alternative.name === 'weaknesses'){
        if(label === 'Issue') score = -1;
        if(label === 'Problem') score = -2;
        if(label === 'Disaster') score = -3;
      } 
      
      if($scope.alternative.attributes[i].showScore){
        if($scope.alternative.attributes[i].showScore === score) {
          $scope.alternative.attributes[i].showScore = false;
          $scope.alternative.attributes[i].showScoreFilter = false;
        } else {
          $scope.alternative.attributes[i].showScore = score;
          $scope.alternative.attributes[i].showScoreFilter = true;
        }
        
      } else {
        $scope.alternative.attributes[i].showScore = score;
        $scope.alternative.attributes[i].showScoreFilter = true;
      }
      $scope.$apply();
      console.log($scope.alternative.attributes[i].showScore);
      console.log($scope.alternative.attributes[i].showScoreFilter);
      
    }
  }
  

});
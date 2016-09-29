
angular.module('choiso').controller('alternativesCtrl', function ($scope, $rootScope, $http, NgTableParams, $window, SweetAlert, $state, $stateParams, $timeout, $http, toaster, User, Data) {

  console.log('== Alternative ==');
    
  var titles = {
    main: 'Add And Evaluate Alternatives',
    requestAlternatives : 'Request Alternatives'
  }
  $scope.activeDrag = 'proposal';

  $scope.altRequestArr = [];
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
      $scope.isMyReq = false;
  };

  $scope.back = function(){
      $scope.alternative = undefined;
      $scope.isMyReq = false;
      $scope.askAlternatives = false;
      $scope.title = titles.main;
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
        $scope.altRequestArr.push($scope.appData.contacts[section].list[index]);
        console.log($scope.appData.contacts[section].list);
        console.log($scope.altRequestArr);
      }

  };

  $scope.enableAlternativeDrag = function(name){
    var flag = true;
     $scope.alts.forEach(function(alt){
       if(alt.name === name) flag = false;
     });
    return flag;
  };

  $scope.setProvider = function(i){
      $scope.activeProvider = $scope.providers[i];
      setProfAdded();
  };

  function setProfAdded(){
    if($scope.activeProvider && $scope.activeProvider.professions){
      for(var i = 0 ; i < $scope.activeProvider.professions.length ; i++){
        $scope.activeProvider.professions[i].added = !$scope.enableAlternativeDrag($scope.activeProvider.professions[i].name);
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
    

});
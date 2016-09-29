'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Trait = require('../models/trait'),
    Profession = require('../models/profession'),
    Requirement = require('../models/requirement'),
    User = require('../models/user'),
    Provider = require('../models/provider'),
    Request = require('../models/request'),
    extend = require('extend'),
    config = require('../../config');

var prof = require('./prof.json');


// 
exports.start = function(req,res){
    
  var counter = 0, data = {}, traits;
  
    Profession.find().populate('requirements').lean().exec(function(err, model){
      data.professions = model;
      finish();
    });
  
    Trait.find().lean().exec(function(err, model){
      traits = model;
      finish();
    });
  
    Provider.find().lean().exec(function(err, model){
      data.providers = model;
      finish();
    });
  
    Request.find().lean()
      .where('from').equals(req.user._id)
      .where('answered').exists(true)
      .populate('to', 'displayName avatar')
      .exec(function(err, model){
        data.requests = model;
        finish();
      });
  
    User.find().lean()
      .where('family').equals(req.user._id)
      .exec(function(err, model){
        data.family = model;
        finish();
      });
  
    User.find().lean()
      .where('family').exists(false)
      .where('_id').ne(req.user._id)
      .exec(function(err, model){
        data.network = model;
        finish();
      });
  
    User.find().lean()
      .where('_id').in(req.user.recentContacts)
      .exec(function(err, model){
        data.recent = model;
        finish();
      });
  
  function finish(){
    counter++;
    if(counter === 7) {
      setData();
      setContact();
      setRequests();
      res.json(data);
    }
  }
  
  function setData(){
    data.providers.forEach(function(provider, i){
      
      var pro = [], tra = [];
      data.professions.forEach(function(profession, i){
        if(provider.id === profession.providerId) pro.push(profession);
      });
      data.providers[i].professions = pro;
      
      traits.forEach(function(trait, i){
        if(provider.id === trait.providerId) tra.push(trait);
      });
      data.providers[i].traits = tra;
    });
  }
  
  function setRequests(){
    data.requests.forEach(function(request, i){
      
      request.name = request.to.displayName;
      request.avatar = request.to.avatar;
      request.professions = [];
      
      request.alternatives.forEach(function(alt){
        request.professions.push({
          name: alt.name,
          _id: alt._id,
          providerId: request.to._id,
          providerId: request.to._id,
          requirements: []
        })
      });
      
      data.providers.push(request);
        
    });
  }
  function setContact(){
    
    data.contacts = [
      {index: 0, name: 'Network', list: data.network},
      {index: 1, name: 'Family', list: data.family},
      {index: 2, name: 'Recent', list: data.recent}
    ];
    delete data.network;
    delete data.family;
    delete data.recent;
  }
    
};

// 
exports.get = function(req,res){
    
    Profession.find().exec(function(err, model){
      res.json(model);
    });
    
};

function setProfs(){
  
  //var proffs = [];
  
  //  get Requirements
  Requirement.find().exec(function(err, reqs){

    // for every proffesion
    prof.forEach(function(p){
      
      var reqqs = []
      
      // loop proffesion requierements
      p.requirements.forEach(function(reqq){
          var r = _.find(reqs, {id: reqq}) ;
          reqqs.push(r._id);
      });
      p.requirements = reqqs;
      //proffs.push(p);
      
      p = new Profession(p);
      p.save(function(err){
        console.log(err);
      });;
    });
    
    //console.log(proffs);
  });
}
var users = [{ "_id" : { "$oid" : "57e144094165b9566e518751" }, "id" : 1, "testGroupId" : 2, "email" : "jane@mail.com", "firstName" : "Jane", "lastName" : "Military", "family" : [ 4, 5 ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" },
{ "_id" : { "$oid" : "57e144094165b9566e518753" }, "id" : 3, "testGroupId" : 2, "email" : "paul@mail.com", "firstName" : "Paul", "lastName" : "Smith", "family" : [ 8, 9 ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518754" }, "id" : 4, "testGroupId" : 1, "email" : "samantha@mail.com", "firstName" : "Samantha", "lastName" : "Fox", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518755" }, "id" : 5, "testGroupId" : 2, "email" : "richard@mail.com", "firstName" : "Richard", "lastName" : "Bronson", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518756" }, "id" : 6, "testGroupId" : 2, "email" : "rivka@mail.com", "firstName" : "Rivka", "lastName" : "Friedman", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518757" }, "id" : 7, "testGroupId" : 1, "email" : "aaron@mail.com", "firstName" : "Aaron", "lastName" : "Paul", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518758" }, "id" : 8, "testGroupId" : 2, "email" : "alon@mail.com", "firstName" : "Alon", "lastName" : "Rachman", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e518759" }, "id" : 9, "testGroupId" : 2, "email" : "jennie@mail.com", "firstName" : "Jennie", "lastName" : "Jackson", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e51875a" }, "id" : 10, "testGroupId" : 1, "email" : "wayne@mail.com", "firstName" : "Wayne", "lastName" : "Garrison", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e51875b" }, "id" : 11, "testGroupId" : 2, "email" : "itzik@mail.com", "firstName" : "Itzik", "lastName" : "Sharon", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e1440a4165b9566e51875c" }, "id" : 12, "testGroupId" : 2, "email" : "avraam@mail.com", "firstName" : "Avraaam", "lastName" : "Lincoln", "family" : [  ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm" }
,{ "_id" : { "$oid" : "57e144094165b9566e518752" }, "id" : 2, "testGroupId" : 1, "email" : "john@mail.com", "firstName" : "John", "lastName" : "Edward", "family" : [ 6, 7 ], "password" : "$2a$08$Bq/l4o2yGHFp365jU6scueSOVGrSaaWyxWyL6ccfW03BY8PED2lOm", "displayName" : "John Edward", "alternatives" : [ { "name" : "Engineer", "score" : 10, "attitude" : -1, "_id" : { "$oid" : "57e664d5ab6cea6c15728536" }, "traits" : [  ], "timeStamp" : 1.474716877009E12 }, { "name" : "Medical Doctor", "score" : 6, "attitude" : -1, "_id" : { "$oid" : "57e664fdab6cea6c15728537" }, "traits" : [  ], "timeStamp" : 1.474716877009E12 }, { "name" : "Teacher", "score" : 3, "attitude" : -1, "_id" : { "$oid" : "57e66510ab6cea6c15728538" }, "traits" : [  ], "timeStamp" : 1.474716877009E12 }, { "name" : "Archeologist", "score" : 8, "attitude" : -1, "_id" : { "$oid" : "57e6f27cda53d5bc238bb74a" }, "traits" : [  ], "timeStamp" : 1.474752549626E12 } ] }];
//setProfs();
//setUsers();

function setUsers(){
  
  var final = [];
    var matches = []
    users.forEach(function(main){
      if(main.family.length > 0) {
        console.log(main.id);
        main.family.forEach(function(member){
          matches.push({main: main._id.$oid, member: member});
        });
      } else {
        /*delete main.family;
        main._id = main._id.$oid;
        main = new User(main);
        main.save(function(err){
          console.log(err);
        });*/
      }
    });
  console.log(matches);
  users.forEach(function(main){
    
    matches.forEach(function(match){
      if(match.member === main.id) {
        main.family = match.main;
      }
    });
    
    if(typeof main.family !== 'string') delete main.family;
    
    main._id = main._id.$oid;
    main.displayName = main.firstName + ' ' + main.lastName;
    //final.push(main);
    main = new User(main);
    main.save();
  });
  console.log(final);
    
}




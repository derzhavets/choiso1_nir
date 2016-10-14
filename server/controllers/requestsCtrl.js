'use strict';

var mongoose = require('mongoose'),
    //_ = require('lodash'),
    cloudinary = require('cloudinary'),
    User = require('../models/user'),
    Request = require('../models/request'),
    extend = require('extend'),
    Email = require('../services/emailService'),
    config = require('../../config');


// create
exports.create = function(req,res){
    
  var now = new Date().getTime();
  var counter = 0;
  var errors = [];
  
  req.body.forEach(function(request){
    request = new Request(request);
    request.from = req.user._id;
    request.created = now;
    request.save(function(err){
      if(err) return finish(request.to);
      Email.sendRequest(request);
      finish();
    });
  });
  
  function finish(err){
    counter++;
    if(err) errors.push(err);
    
    if(counter === req.body.length){
      if(errors.length > 0) res.status(500).json(errors);
      else return res.sendStatus(200);
    }
  }
    
};


// list by section 
exports.listBySection = function(req,res){
  
    Request.find()
      .where('from').equals(req.user._id)
      .where('section').equals(req.params.section)
      .populate('to', 'displayName firstName avatar')
      .exec(function(err, data){
        if(err) return res.sendStatus(500);
        return res.json(data);
      });
};
  
  // list 
exports.list = function(req,res){
  
    Request.find()
      .where('to').equals(req.user._id)
      .where('answered').exists(false)
      .populate('from', 'displayName firstName avatar alternatives traits')
      .lean()
      .exec(function(err, data){
        if(err) return res.sendStatus(500);
      
        res.json(data);
      });
  
};
  
  
    
// update 
exports.update = function(req,res){
    
  var request = new Request(req.body);

  Request.findById(req.params.section).exec(function(err, request){
    if(err || !request) return res.sendStatus(500);
    
    if(request.section === 'alternatives'){
      request.alternatives = req.body.alternatives;
    } else if(request.section === 'requirements'){
      request.requirements = req.body.requirements;
    } else if(request.section === 'requirements-eval'){
      request.requirementsEval = req.body.requirementsEval;
    } else if(request.section === 'lists'){
      request.lists = req.body.lists;
    } else if(request.section === 'attributes'){
      request.traits = req.body.traits;
    } else if(request.section === 'attributes-eval'){
      request.traitsEval = req.body.traitsEval;
      //request.attrEvalList = req.body.attrEvalList;
    }
    
    request.answered = new Date().getTime();
    
    request.save(function(err){
      if(err) return res.sendStatus(500);
      
      if(request.section === 'requirements-eval') {
        saveReqToUser(request);
      } else if(request.section === 'attributes-eval') {
        saveAttrToUser(request);
      } else {
        Email.sendRequest(request);
        res.sendStatus(200);
      }
    });
    
  });
  
  function saveReqToUser(request){
    User.findById(request.from).exec(function(err, user){
      if(err || !user) return res.sendStatus(500);
      user.alternatives.forEach(function(alternative){
        if(alternative.name === request.alternative){
          alternative.requirements.forEach(function(requirement){
            request.requirementsEval.forEach(function(evaluation){
              if(evaluation.parent === requirement.name){
                if(requirement.evals) {
                  requirement.evals.push({
                    user: evaluation.providerId,
                    score: evaluation.score,
                    timeStamp: new Date().getTime()
                  });
                } else {
                  requirement.evals = [{
                    user: evaluation.providerId,
                    score: evaluation.score,
                    timeStamp: new Date().getTime()
                  }];
                }
              }
            });
          });
        }
      });
      user.save(function(err){
        if(err) return res.sendStatus(500);
        Email.sendRequest(request);
        res.sendStatus(200);
      });
    });
  }
  
  function saveAttrToUser(request){
    User.findById(request.from).exec(function(err, user){
      if(err || !user) return res.sendStatus(500);
      user.traits.forEach(function(trait){
        if(trait.name === request.alternative){
          trait.attributes.forEach(function(attribute){
            request.traitsEval.forEach(function(evaluation){
              if(evaluation.parent === attribute.name){
                if(attribute.evals) {
                  attribute.evals.push({
                    user: evaluation.providerId,
                    score: evaluation.score,
                    timeStamp: new Date().getTime()
                  });
                } else {
                  attribute.evals = [{
                    user: evaluation.providerId,
                    score: evaluation.score,
                    timeStamp: new Date().getTime()
                  }];
                }
              }
            });
          });
        }
      });
      console.log(user.traits);
      user.save(function(err){
        if(err) return res.sendStatus(500);
        Email.sendRequest(request);
        res.sendStatus(200);
      });
    });
  }
  
};


// delete
exports.delete = function(req,res){
    
    var user = req.user;
        
    for( var i = 0 ; i < user.alternatives.length ; i++){
        if(user.alternatives[i]._id == req.params.id) {
            user.alternatives.splice(i,1);
            break;
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.alternatives);
    });
    
};

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
      .populate('from', 'displayName firstName avatar alternatives')
      .lean()
      .exec(function(err, data){
        if(err) return res.sendStatus(500);
      
        // remove alternatives if not set to 'show'
        for(var i = 0 ; i < data.length ; i++){
          if(!data[i].show) delete data[i].from.alternatives;
        }       
      
        res.json(data);
      });
  
};
  
  
    
// update 
exports.update = function(req,res){
    
  var request = new Request(req.body);

  Request.findById(req.params.section).exec(function(err, request){
    if(err || !request) return res.sendStatus(500);
    
    request.alternatives = req.body.alternatives;
    request.answered = new Date().getTime();
    
    request.save(function(err){
      if(err) return res.sendStatus(500);
      Email.sendRequest(request);
      res.sendStatus(200);
    });
    
  });
  
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

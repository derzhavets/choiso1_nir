'use strict';

var mongoose = require('mongoose'),
    //_ = require('lodash'),
    cloudinary = require('cloudinary'),
    User = require('../models/user'),
    extend = require('extend'),
    config = require('../../config');


// create
exports.create = function(req,res){
    
    var user = req.user;
    var index = undefined;
    user.alternatives.forEach(function(alt,i){
        if(req.params.id == alt._id){
            index = i;
            console.log('foundddd')
            if(alt.requirements)
              alt.requirements.push(req.body);
            else 
              alt.requirements = [req.body];
        }
    });
    console.log(req.body);
    console.log(user.alternatives[index]);
    user.save(function(err){
        if(err) return res.sendStatus(500);
        if(index < 0) return res.sendStatus(404);
        res.json(user.alternatives[index]);
    });
    
};


// set Score 
exports.setScore = function(req,res){
    
    var user = req.user;
    var index = 0;
  
    for( var i = 0 ; i < user.alternatives.length ; i++){
        if(user.alternatives[i]._id == req.params.id) {
          console.log('found alt')
            index = i;
            user.alternatives[i].requirements.forEach(function(requirement, k){
              console.log(requirement._id)
              if(req.params.reqId == requirement._id){
                  console.log('foundddd')
                  user.alternatives[i].requirements[k].score = req.params.score;
              }
              
            });
          
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        if(index < 0) return res.sendStatus(404);
        res.json(user.alternatives[index]);
    });
        
    
};


// delete
exports.delete = function(req,res){
    
    var user = req.user;
    var index = undefined;
  
    for( var i = 0 ; i < user.alternatives.length ; i++){
        if(user.alternatives[i]._id == req.params.id) {
          
            index = i;
            user.alternatives[i].requirements.forEach(function(requirement, k){
              
              if(req.params.reqId == requirement._id){
                  console.log('foundddd')
                  user.alternatives[i].requirements.splice(k,1);
              }
              
            });
          
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        if(index < 0) return res.sendStatus(404);
        res.json(user.alternatives[index]);
    });
    
};

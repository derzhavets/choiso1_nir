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
    user.traits.forEach(function(alt,i){
        if(req.params.id == alt._id){
            index = i;
            console.log('foundddd')
            if(alt.attributes)
              alt.attributes.push(req.body);
            else 
              alt.attributes = [req.body];
        }
    });
    console.log(req.body);
    console.log(user.traits[index]);
    user.save(function(err){
        if(err) return res.sendStatus(500);
        if(index < 0) return res.sendStatus(404);
        res.json(user.traits[index]);
    });
    
};


// set Score 
exports.setScore = function(req,res){
    
    var user = req.user;
    var index = 0;
  
    for( var i = 0 ; i < user.traits.length ; i++){
        if(user.traits[i]._id == req.params.id) {
          console.log('found alt')
            index = i;
            user.traits[i].attributes.forEach(function(requirement, k){
              console.log(requirement._id)
              if(req.params.reqId == requirement._id){
                  console.log('foundddd')
                  user.traits[i].attributes[k].score = req.params.score;
              }
              
            });
          
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        if(index < 0) return res.sendStatus(404);
        res.json(user.traits[index]);
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

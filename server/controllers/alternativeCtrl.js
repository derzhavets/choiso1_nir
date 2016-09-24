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
    
    user.alternatives.push(req.body);
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.alternatives);
    });
    
};


// update 
exports.update = function(req,res){
    
    var user = req.user;
        
    for( var i = 0 ; i < user.alternatives.length ; i++){
        if(user.alternatives[i]._id == req.params.id) {
            extend(user.alternatives[i], req.body);
            break;
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.alternatives);
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

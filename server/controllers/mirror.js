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
    if(!user.traits) user.traits = [];
    user.traits.push(req.body);
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.traits);
    });
    
};


// update 
exports.update = function(req,res){
    
    var user = req.user;
        
    for( var i = 0 ; i < user.traits.length ; i++){
        if(user.traits[i]._id == req.params.id) {
            extend(user.traits[i], req.body);
            break;
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.traits);
    });
        
    
};


// delete
exports.delete = function(req,res){
    
    var user = req.user;
        
    for( var i = 0 ; i < user.traits.length ; i++){
        if(user.traits[i]._id == req.params.id) {
            user.traits.splice(i,1);
            break;
        }
    }
    
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.json(user.traits);
    });
    
};

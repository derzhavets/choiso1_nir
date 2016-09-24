'use strict';

var mongoose = require('mongoose'),
    //_ = require('lodash'),
    cloudinary = require('cloudinary'),
    User = require('../models/user'),
    config = require('../../config');


// get current user
exports.me = function(req,res){
    
    delete req.user.password;
    
    res.json(req.user);
};


// update current user
exports.update = function(req,res){
        
    var user = req.user;
    
    // update fields
    user.displayName = req.body.displayName;
        
    // upload image cloudinary
    if(req.body.avatar && req.body.avatar.search('data:image') > -1){
        cloudinary.uploader.upload(req.body.avatar, function(result) { 
            console.log(result);
            user.avatar = result.url;
            save();
        });
    } else { 
        save();
    }
        
    function save(){
        user.save(function(err){
           if(err) return res.sendStatus(500);
           res.json(user);
        });
    }
        
    
};

// create
/*
exports.create = function(req,res){  
    
    if(!req.body.email || !req.body.password) return res.json('missing information');
    
    // check if exists
    var exists = _.find(db.data('users'), { email: req.body.email });
    if(exists) return res.json('user exists');
    
    var lastId = 0;
    var items = db.data('users');
    items.forEach(function(item){
        if(parseInt(item.id) > lastId) lastId = parseInt(item.id);
    });
    
    console.log(req.body);
    
    var time = Math.floor( new Date().getTime());
    var item = new User(req.body);
    
    item.id = lastId + 1;
    item.email = req.body.email.toLowerCase().trim();
    item.password = item.generateHash(req.body.password);
    item.created_at = time;
    item.updated_at = time;
    
    item.save(function(err){
       if(err) return res.sendStatus(500);
       db.refresh();
       res.json(item);
    });
    
};


// list
exports.list = function(req,res){  
    res.json(db.data('users'));
};
*/




// delete
/*
exports.delete = function(req,res){
    
    User.findByIdAndRemove(req.users._id, function (err, item){
        console.log(err);
        if(err) return res.sendStatus(500);
        db.refresh();
        res.json(item);
    });
    
};
*/

// findById middleware
/*
exports.findById = function (req, res, next, id) {
    
    User.findById(req.paramas.userId).exec(function(err, user){
        if(err) return res.sendStatus(500);
        if(!user) return res.sendStatus(404);
        req.profile = user;
        next();
    });
};
*/

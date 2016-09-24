'use strict';

var mongoose = require('mongoose'),
    //_ = require('lodash'),
    cloudinary = require('cloudinary'),
    User = require('../models/user'),
    extend = require('extend'),
    config = require('../../config');


// create
exports.add = function(req,res){
    
    var user = req.user;
    
    user.recentContacts.push(req.params.id);
    user.save(function(err){
        if(err) return res.sendStatus(500);
        res.sendStatus(200);
    });
    
};

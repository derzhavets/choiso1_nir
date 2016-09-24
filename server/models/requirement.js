'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var RequirementSchema = new Schema({
  id: Number,
  name: String,
  
}, { versionKey: false });



module.exports = mongoose.model('Requirement', RequirementSchema);

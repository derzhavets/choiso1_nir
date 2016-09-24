'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var TraitSchema = new Schema({
  id: Number,
  providerId: Number,
  listName: String,
  attributes: [String]
  
}, { versionKey: false });



module.exports = mongoose.model('Trait', TraitSchema);

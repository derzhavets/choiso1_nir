'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var ProviderSchema = new Schema({
  id: Number,
  name: String,
  type: String,
  avatar: String
  
}, { versionKey: false });



module.exports = mongoose.model('Provider', ProviderSchema);

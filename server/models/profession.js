'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var ProfessionSchema = new Schema({
  id: Number,
  providerId: Number,
  name: String,
  requirements: [{
    type: Schema.ObjectId,
    ref: 'Requirement'
  }]
  
}, { versionKey: false });



module.exports = mongoose.model('Profession', ProfessionSchema);

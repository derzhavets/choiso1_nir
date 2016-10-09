'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var RequestSchema = new Schema({

  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  alternative: String, // alternative name
  section: String, // alternatives, mirror, requirements etc.
  type: String, // collect or evaluate
  show: Boolean, // "show what I have"
  alternatives: [{
    name: String,
    providerId: String
  }],
  requirements: [{
    parent: String,
    name: String,
    providerId: String
  }],
  requirementsEval: [{
    parent: String,
    providerId: String,
    score: String
  }],
  /*metadata: [{
    timeStamp: {
        type: Number,
        default: new Date().getTime()
    },
    name: String,
    score: Number,
    attitude: Number,
    traits: [{
      trait: {
        type: Schema.ObjectId,
        ref: 'Trait'
      },
      score: Number,
      timeStamp: {
        type: Number,
        default: new Date().getTime()
      }
      
    }]
  }],
  recentContacts: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],*/
  created: Number,
  answered: Number
}, { versionKey: false });




module.exports = mongoose.model('Request', RequestSchema);

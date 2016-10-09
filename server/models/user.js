'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
  id: Number,
  email: String,
  password: String,
  testGroupId: Number,
  firstName: String,
  lastName: String,
  displayName: String,
  family: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  avatar: String,
  alternatives: [{
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
      
    }],
    requirements: [{
      name: String,
      score: Number,
      evals: [{
        user: {
          type: Schema.ObjectId,
          ref: 'User'
        },
        score: Number,
        timeStamp: {
          type: Number,
          default: new Date().getTime()
        }
      }],
      timeStamp: {
        type: Number,
        default: new Date().getTime()
      }
      
    }]
  }],
  recentContacts: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  created: Number,
  updated: Number
}, { versionKey: false });



// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);

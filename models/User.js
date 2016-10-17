'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  name : String,
  username : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  email : { type: String, required: true, unique: true },
  picture : String,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  if (this.password.length < 16)
    this.password = bcrypt.hashSync(this.password, global.saltRounds);

  next();
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

'use strict';
var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  _author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  done: { type: Boolean, default: false },
  due_date: Date,
  attachments: [{
    location: String,
    author: mongoose.Schema.Types.ObjectId,
    type: String,
    uploaded_at: Date
  }],
  comments: [{
      text: String,
      by: mongoose.Schema.Types.ObjectId
  }],
  tags: [mongoose.Schema.Types.ObjectId],
  conclusion_date: Date,
  created_at: Date,
  updated_at: Date
});

TaskSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

TaskSchema.pre('save', function (next) {
  var modifiedPaths = this.modifiedPaths();

  if (modifiedPaths.done !== undefined) {
      this.conclusion_date = (modifiedPaths.done)? new Date() : null;
  }

  next();
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;

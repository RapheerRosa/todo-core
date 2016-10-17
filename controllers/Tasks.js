var Task = require('../models/Task'),
    jwt = require('jwt-simple'),
    secret = require('../config/secret')();

module.exports = {
  getTasks: function (req, res) {
    var id = jwt.decode(req.headers['x-access-token'], secret).id;
    if (id) {
      Task.find({ _author: id })
        .then(function (tasks) {
          console.log('tasks ', tasks);
          res.status(200).send(tasks);
        }).catch(function (error) {
          res.status(500).send(error);
        });
    } else {
      res.status(400).end();
    }
  },

  createTask: function (req, res) {
    req.assert('title', 'Please, inform the title of your task').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors).end();
    }

    var task = new Task();
    task._author = jwt.decode(req.headers['x-access-token'], secret).id;
    task.title = req.body.title;

    for (key in Task.schema.paths) {
      if (req.body[key] !== undefined)
        task[key] = req.body[key];
    }

    task.save()
      .then(function (status) {
        res.status(201).end();
      }).catch(function (error) {
        res.status(500).send(error);
      });
  },

  // TODO: test update method
  updateTask: function (req, res) {
    req.assert('id', 'Please, inform the Id of the task you want to delete').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
    }

    var task = {};
    for (key in Task.schema.paths) {
      if (req.body[key] !== undefined)
        task[key] = req.body[key];
    }

    Task.findByIdAndUpdate(req.params.id, { $set: task }, { new: true })
      .then(function (task) {
        res.status(200).send(task);
      }).catch(function (error) {
        res.status(500).send(error);
      });
  },

  // TODO: test delete method
  deleteTask: function (req, res) {
    req.assert('id', 'Please, inform the Id of the task you want to delete').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
    }

    Task.delete({ _id: req.params.id })
      .then(function (status) {
        res.status(200).end();
      }).catch(function (error) {
        res.status(500).send(error);
      });
  },

  // TODO: test completion method
  completeTask: function (req, res) {
    req.assert('id', 'Please, inform the Id of the task you want to delete').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
    }

    Task.findByIdAndUpdate(req.params.id, { $set: { done: true }}, { new: true })
      .then(function (status) {
        res.status(200).end();
      }).catch(function (error) {
        res.status(500).send(error);
      });
  }
}

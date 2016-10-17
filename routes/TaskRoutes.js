var Task = require("../controllers/Tasks");

module.exports = function (app) {
  app.get('/api/tasks', Task.getTasks);

  app.post('/api/tasks', Task.createTask);

  app.put('/api/task/:id/done', Task.completeTask);
  app.put('/api/task/:id', Task.updateTask);

  app.delete('/api/tasks/:id', Task.deleteTask);
}

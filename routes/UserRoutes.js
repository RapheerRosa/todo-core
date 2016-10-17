var User = require("../controllers/Users");

module.exports = function (app) {
  app.post('/authenticate', User.authenticate);
}

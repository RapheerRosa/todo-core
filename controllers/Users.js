var User = require('../models/User'),
    jwt = require('jwt-simple'),
    secret = require('../config/secret')();

var tokenExpiration = 2; // 2 hours

function generateAuthResponse(user) {
  return {
    id: user.id,
    token: jwt.encode({
      id: user.id,
      username: user.username,
      email: user.email,
      expires: Date.now() + (tokenExpiration * 60 * 60 * 1000)
    }, secret)
  };
}

module.exports = {

  authenticate: function (req, res) {
    req.assert('username', 'Please, provide a valid username').notEmpty();
    req.assert('password', 'Please, provide a valid password').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors).end();
    }

    User.count({ username: req.body.username, password: req.body.password })
      .then(function (count) {
        if (count !== 1) {
          res.status(401).end();
        } else {
          User.findOne({ username: req.body.username })
            .then(function (user) {
              res.status(200).send(generateAuthResponse(user));
            }).catch(function (error) {
              res.status(500).send(error);
            });
        }
      }).catch(function (error) {
        res.status(500).send(error);
      });
  },

  validateUser: function (username, cb) {
    User.count({ username: username })
      .then(function (count) {
        return cb(count);
      }).catch(function (error) {
        res.status(500).send(error);
      });
  }

}

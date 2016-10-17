'use strict';
var jwt = require('jwt-simple'),
    validateUser = require('../controllers/Users').validateUser;

module.exports = function(req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'],
        key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token && key) {
        try {
            var decoded = jwt.decode(token, require('../config/secret.js')());

            if (decoded.username !== key) {
              res.status(403).send({
                  message: "Invalid credentials"
              });
            }

            if (decoded.expires <= Date.now()) {
              res.status(401).res.send({
                message: "Token Expired"
              });
              return;
            }

            validateUser(key, function(dbUser) {
                if (dbUser) {
                    if (req.url.indexOf('/api') >= 0) {
                        next();
                    } else {
                        res.status(403).send({
                            message: "Not Authorized"
                        });
                        return;
                    }
                } else {
                    res.status(401).send({
                        message: "Invalid User"
                    });
                    return;
                }
            });
        } catch (err) {
            res.status(500).send({
                message: "Oops something went wrong",
                error: err
            });
        }
    } else {
        res.status(401).send({
            message: "Invalid Token or Key"
        });
        return;
    }
};

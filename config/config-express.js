var express = require('express'),
    consign = require('consign'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator'),
    morgan = require('morgan'),
    Promise = require('bluebird'),
    logger = require('../services/logger');

module.exports = function () {
    var app = express();

    // app.use(morgan('common', {
    //   stream: {
    //     write: function (message) {
    //       logger.info(message);
    //     }
    //   }
    // }));

    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(expressValidator());

    mongoose.connect('mongodb://localhost/todo', {
      server: {
        poolSize: 5
      }
    });

    mongoose.Promise = Promise;

    global.saltRounds = 10;

    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
      if (req.method == 'OPTIONS') {
        res.status(200).end();
      } else {
        next();
      }
    });

    app.all('/api/*', [require('../middlewares/validateRequest')]);

    consign()
      .include('routes')
      .then('services')
      .into(app);

    return app;
}

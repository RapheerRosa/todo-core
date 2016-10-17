var winston = require('winston'),
    fs = require('fs');

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/todo.log',
      maxSize: 100000,
      maxFiles: 10
    })
  ]
});

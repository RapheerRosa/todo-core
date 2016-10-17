var cluster = require('cluster'),
    os = require('os');

if (cluster.isMaster) {
  var cpus = os.cpus();
  cpus.forEach(function () {
    cluster.fork();
  });

  cluster.on('exit', function () {
    cluster.fork();
  });

} else {
  require('./server');
}

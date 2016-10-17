var app = require('./config/config-express')();

app.listen(process.env.PORT || 3030, function (){
  console.log('server started');
});

var express = require('express');
var tinycontroller = require('./controller/tinycontroller');

var app = express();

app.set('view engine','ejs');

tinycontroller(app);

app.listen(3099,function(){
  console.log("Server URL shortening is running !!!");
});

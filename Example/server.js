var express = require('express');
var app = express();
var System = require('es6-module-loader').System;
System.transpiler = 'babel';

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');


app.get('/', function(request, response) {
  System.import('contwidgetor').then(function(m) {
    console.log(m);
  });
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

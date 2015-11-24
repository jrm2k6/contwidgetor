var express = require('express');
var contwidgetor = require('contwidgetor');

var app = express();

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');


app.get('/', function(request, response) {
  res.render('index');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

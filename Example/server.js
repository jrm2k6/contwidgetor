var express = require('express');
var contwidgetor = require('contwidgetor');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');


app.get('/', function(request, response) {
  var _contributionsGridElem = contwidgetor.getContributionsGridWidget();
  response.render('index.ejs', {contributionsGrid: _contributionsGridElem});
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

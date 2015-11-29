var express = require('express');
var contwidgetor = require('contwidgetor');
var fs = require('fs');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');
app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(request, response) {
  var _contributionsGridElem = contwidgetor.getContributionsGridWidget();
  response.render('index.ejs', {contributionsGrid: _contributionsGridElem});
});

app.get('/contributions', function(request, response) {
  response.setHeader('Content-Type', 'application/json');

  var PATH_CONTRIBUTIONS_JSON = process.cwd() + '/' + process.env.JSON_FILENAME + '.json'
  try {
    var fileStats = fs.statSync(PATH_CONTRIBUTIONS_JSON);
    var _contributions = require(PATH_CONTRIBUTIONS_JSON);
    response.send(JSON.stringify(_contributions));
    response.end();
  } catch (_) {
    response.send(JSON.stringify([]));
    response.end();
  }
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

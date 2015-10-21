var http = require('http');
var babelify = require('babelify');
var browserify = require('browserify');

http.createServer(function(req, res) {
    if (req.url == '/bundle.js') {
        res.setHeader('Content-Type', 'text/javascript')

        browserify({debug: true})
          .add('./browser.js')
          .transform(babelify)
          .bundle()
          .pipe(res)
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(3000, function(err) {
  if (err) throw err
  console.log('Listening on 3000...')
})

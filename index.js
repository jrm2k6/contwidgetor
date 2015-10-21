require('babel/register');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var App = require('./src/ui/grid');

module.exports = ReactDOMServer.renderToStaticMarkup(React.createElement(App));

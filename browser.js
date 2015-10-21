require('babel/register');

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./src/ui/grid');

ReactDOM.render(React.createElement(App), document.body);

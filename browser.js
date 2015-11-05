require('babel/register');

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./src/ui/grid');
var _contributions = require('./dummy-data.json');

ReactDOM.render(React.createElement(App, {contributions: _contributions}), document.getElementById('react-content'));

var contwidgetorUi = require('contwidgetor-ui');
var ReactDOM = require('react-dom');
var React = require('react');
var ContributionsGrid = contwidgetorUi.ContributionsGrid;
var NoContributionsGrid = contwidgetorUi.NoContributionsGrid;

$(document).ready(function() {
  var _contributions = require('./my-contributions.json');
  ReactDOM.render(React.createElement(ContributionsGrid, {contributions: _contributions}),
    document.getElementById('react-container'));
});

import React from 'react';
import ReactDOMServer from 'react-dom/server';

var {
    DOM,
    createFactory
} = React;

var App = React.createClass({
    render: function() {
        return (
            <div>Grid</div>
        );
    }
});


module.exports = App;

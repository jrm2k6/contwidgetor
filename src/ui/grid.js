import React from 'react';
import ReactDOMServer from 'react-dom/server';

var {
    DOM,
    createFactory
} = React;

var App = React.createClass({
    getInitialState: function() {
        return {
            contributions: []
        };
    },

    componentWillMount: function() {
        let contributionsProps = this.props.contributions;
        let _contributions = Object.keys(contributionsProps).map(
            item => [item, contributionsProps[item]]
        );

        this.setState({'contributions': _contributions});
    },

    render: function() {
        let nbContributions = this.state.contributions.length;
        return (
            <div>Grid {nbContributions}</div>
        );
    }
});


module.exports = App;

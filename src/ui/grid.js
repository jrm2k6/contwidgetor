import React from 'react';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment';

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
        const dateOneYearAgo = moment().subtract(1, 'y');

        let contributionsYear = Object.keys(contributionsProps).filter(
            (item) => {
                return moment(item).isAfter(dateOneYearAgo);
            }
        );

        let _contributions = contributionsYear.map(
            (item) => {
                return [item, contributionsProps[item]];
            }
        );

        this.setState({'contributions': _contributions});
    },

    render: function() {
        let nbContributions = this.state.contributions.length;
        return (
            <div className="flex-container">
                {this.state.contributions.map((item, index) => {
                    let date = item[0];
                    let nbCommits = item[1];
                    return (
                        <div key={index} className="flex-item">
                            {nbCommits}
                        </div>
                    );
                })}
            </div>
        );
    }
});


module.exports = App;

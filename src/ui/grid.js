import React from 'react';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment';
import _ from 'lodash';

var {
    DOM,
    createFactory
} = React;

var MonthHeader = React.createClass({
    render: function() {
        let _styles = this.getStyles();
        let months = this.generateShortMonths(this.props.startingMonth);
        return (
            <div style={_styles.container}>
                {months.map(item => <span style={_styles.item} key={item}>{item}</span>)}
            </div>
        );
    },

    generateShortMonths: function(startingMonth) {
        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return shortMonths.slice(startingMonth)
                    .concat(shortMonths.slice(0, startingMonth));
    },

    getStyles: function() {
        return {
            container: {
                'display': 'flex',
                'marginLeft': '35px',
                'justifyContent': 'space-between',
                'width': '100%'
            },

            item: {
                'flex': 1
            }
        };
    }
});


var App = React.createClass({
    getInitialState: function() {
        return {
            contributions: [],
            startingMonth: null
        };
    },

    generateAllDates: function(startingDate, endDate) {
        let allDates = [];
        let [yearStartingDate, monthStartingDate, dayStartingDate] = startingDate.split('-');
        let [yearEndDate, monthEndDate, dayEndDate] = endDate.split('-');

        allDates = allDates.concat(this.generateDatesMonth(yearStartingDate, monthStartingDate, parseInt(dayStartingDate) + 1));
        let monthsToGenerate = this.getMonths(monthStartingDate);
        let otherDates = monthsToGenerate.map((month) => {
            return this.generateDatesMonth(yearStartingDate, month, 1);
        });

        allDates = allDates.concat(_.flatten(otherDates));
        allDates = allDates.concat(this.generateDatesMonth(yearEndDate, monthEndDate, parseInt(dayEndDate) + 1));

        return allDates;
    },

    getMonths: function(startingMonth) {
        let i = 0;
        let res = [];
        let currentVal = parseInt(startingMonth) + 1;

        while (i < 11) {
            res.push(currentVal.toString());
            currentVal = (parseInt(currentVal) + 1 > 12)
                                ? '01'
                                : this.getIntValAsString((parseInt(currentVal) + 1).toString());
            i++;
        }

        return res;
    },

    getIntValAsString: function(val) {
        if (val.length === 1) {
            return '0' + val;
        } else {
            return val.toString();
        }
    },

    generateDatesMonth: function(_year, _month, fromDay) {
        let res = [];
        const numDaysInMonths = {'01': 30, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30,
                        '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31};

        let numDays = numDaysInMonths[_month];

        for (var i=fromDay; i<numDays+1; i++) {
            res.push(_year + '-' + _month + '-' + this.getIntValAsString(i.toString()));
        }

        return res;
    },

    componentWillMount: function() {
        let contributionsProps = this.props.contributions;
        const dateOneYearAgo = moment().subtract(1, 'y');

        let contributionsYear = Object.keys(contributionsProps).filter(
            (item) => {
                return moment(item).isAfter(dateOneYearAgo);
            }
        );

        let _contributions = contributionsYear.map(item => [item, contributionsProps[item]]);

        let allDates = this.generateAllDates(_contributions[0][0], moment().format('YYYY-MM-DD'));
        let allDatesContributions = allDates.map(_date => [_date, 0]);
        let allYearContributions =  _.merge(allDatesContributions, _contributions).sort(this.sortByDate);
        this.setState({'contributions': allYearContributions, 'startingMonth': moment().get('month')});
    },

    sortByDate: function(elem1, elem2) {
        return new Date(elem1[0]) - new Date(elem2[0]);
    },

    render: function() {
        let _styles = this.getStyles();
        return (
            <div style={_styles.cwContainer}>
                <div style={_styles.cwDays}>
                    <span>M</span>
                    <span>W</span>
                    <span>F</span>
                </div>
                <div style={_styles.cwGridContainer}>
                    <MonthHeader startingMonth={this.state.startingMonth}/>
                    <div style={_styles.cwContributions}>
                        {this.state.contributions.map((item, index) => {
                            let date = item[0];
                            let nbCommits = item[1];
                            return (
                                <div key={index} style={_styles.cwContributionsItem}></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    },

    getStyles: function() {
        return {
            cwContainer: {
                'display': 'flex',
                'width': '850px'
            },

            cwDays: {
                'display': 'flex',
                'flexDirection': 'column',
                'alignItems': 'center',
                'justifyContent': 'space-between',
                'marginTop': '35px',
                'height': '90px'
            },

            cwGridContainer: {
                'display': 'flex',
                'flexDirection': 'column',
                'justifyContent': 'center',
                'width': '100%',
                'height': '150px'
            },

            cwContributions: {
                'display': 'flex',
                'flexDirection': 'column',
                'flexWrap': 'wrap',
                'justifyContent': 'flex-start',
                'alignItems': 'flex-start',
                'width': '97%',
                'marginLeft': '10px',
                'height': '130px',
            },

            cwContributionsItem: {
                'minWidth': '15px',
                'minHeight': '15px',
                'border': '1px solid black',
            }
        };
    }
});


module.exports = App;

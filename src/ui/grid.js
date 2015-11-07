import React from 'react';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment';
import _ from 'lodash';

import { generateShortMonths, generateAllDates }from '../utils/date-utils';

var {
    DOM,
    createFactory
} = React;

var MonthHeader = React.createClass({
    render: function() {
        let _styles = this.getStyles();
        let months = generateShortMonths(this.props.startingMonth);
        return (
            <div style={_styles.container}>
                {months.map(item => <span style={_styles.item} key={item}>{item}</span>)}
            </div>
        );
    },

    getStyles: function() {
        return {
            container: {
                'display': 'flex',
                'marginLeft': '35px',
                'justifyContent': 'space-between',
                'width': '100%',
                'color': '#aaa',
                'fontSize': '12px',
                'font': '13px/1.4 Helvetica'
            },

            item: {
                'flex': 1
            }
        };
    }
});

var ContributionCell = React.createClass({
    render: function() {
        let tooltip = (this.props.indexHoveredCell === this.props.index) ? this.getTooltip() : null;
        return (
            <div style={{'position': 'relative'}} onMouseEnter={this.onMouseEnter}>
                {tooltip}
                <div style={this.props.cellStyle}>
                </div>
            </div>
        );
    },

    onMouseEnter: function() {
        this.props.updateHoveredCell(this.props.index);
    },

    getTooltip: function() {
        let tooltipsStyle = {
            'position': 'absolute',
            'padding': '7px',
            'textAlign': 'center',
            'backgroundColor': 'black',
            'color': '#aaa',
            'borderRadius': '4px',
            'zIndex': '1',
            'minWidth': '190px',
            'top': '-35px',
            'left': '-95px',
            'color': '#aaa',
            'font': '11px/1.4 Helvetica'
        };
        let startText = 'No contributions on ';

        if (this.props.numCommits > 0) {
            let pluralizedTextIfNeeded = (this.props.numCommits  > 1) ? ' contributions on ': ' contribution on';
            startText = this.props.numCommits + pluralizedTextIfNeeded;
        }

        let contentTooltip = startText + moment(this.props.date).format('MMM Do, YYYY');
        return (
            <span style={tooltipsStyle}>{contentTooltip}</span>
        );
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            contributions: [],
            startingMonth: null,
            hoveredIndex: -1
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

        let _contributions = contributionsYear.map(item => [item, contributionsProps[item]]);
        let allDates = generateAllDates(_contributions[0][0], moment().format('YYYY-MM-DD'));
        let allDatesContributions = allDates.map(_date => [_date, 0]);
        let daysBackToClosestSunday = getDaysBackToClosestSunday(_.first(allDates));
        allDatesContributions = daysBackToClosestSunday.concat(allDatesContributions);

        let allYearContributions = allDatesContributions.map((item) => {
            let matchingItem = this.getMatchingItem(_contributions, item);
            if (matchingItem != null) {
                return matchingItem;
            } else {
                return item;
            }
        });

        this.setState({'contributions': allYearContributions, 'startingMonth': moment().get('month')});
    },

    getMatchingItem: function(_contributions, item) {
        return _contributions.filter((contribution) => {
            return contribution[0] === item[0];
        })[0];
    },

    sortByDate: function(elem1, elem2) {
        return new Date(elem1[0]) - new Date(elem2[0]);
    },

    render: function() {
        let _styles = this.getStyles();
        let quartilesValues = this.getQuartilesValuesFromNumCommits(this.state.contributions);
        return (
            <div style={_styles.cwContainer}>
                <div style={_styles.cwDays}>
                    <span>M</span>
                    <span>W</span>
                    <span>F</span>
                </div>
                <div style={_styles.cwGridContainer}>
                    <MonthHeader startingMonth={this.state.startingMonth}/>
                    <div style={_styles.cwContributions}
                        onMouseLeave={this.onMouseLeave}>
                        {this.state.contributions.map((item, index) => {
                            let date = item[0];
                            let nbCommits = item[1];
                            let colorCell = this.getColorCell(nbCommits, quartilesValues);
                            let _mergedStyles = _.merge({'backgroundColor': colorCell}, _styles.cwContributionsItem);
                            return (
                                <ContributionCell cellStyle={_mergedStyles} date={date} numCommits={nbCommits}
                                    key={index} index={index} updateHoveredCell={this.updateHoveredCell}
                                    indexHoveredCell={this.state.hoveredIndex}/>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    },

    updateHoveredCell: function(indexCell) {
        this.setState({hoveredIndex: indexCell});
    },

    onMouseLeave: function() {
        this.setState({hoveredIndex: -1});
    },

    getQuartilesValuesFromNumCommits: function(contributions) {
        let numCommits = contributions.map(item => item[1]).filter(num => num > 0);
        let quartiles = this.getQuartilesValues(numCommits.sort((item1, item2) => {return item1 - item2}));

        return quartiles;
    },

    getColorCell: function(nbCommits, quartilesValues) {
        let [fqv, median, lqv] = quartilesValues;
        if (nbCommits === 0) {
            return '#eee';
        } else if (nbCommits <= fqv) {
            return '#d6e685';
        } else if (nbCommits > fqv && nbCommits <= median) {
            return '#8cc665';
        } else if (nbCommits > median && nbCommits <= lqv) {
            return '#44a340';
        } else {
            return '#1e6823';
        }
    },

    getMedian: function(orderedNumCommits) {
        let midArr = Math.floor(orderedNumCommits.length / 2);
        if (orderedNumCommits.length % 2 === 0) {
            let firstItem = orderedNumCommits[midArr-1];
            let secondItem = orderedNumCommits[midArr];
            return [false, Math.round((secondItem + firstItem) / 2)];
        } else {
            return [true, orderedNumCommits[midArr]];
        }
    },

    getQuartilesValues: function(orderedNumCommits) {
        let [isDatum, median] = this.getMedian(orderedNumCommits);
        let [lowerHalf, greaterHalf] = _.partition(orderedNumCommits, (numCommit) => numCommit < median);

        let [dl, medianLowerHalf] = this.getMedian(lowerHalf);
        let [dg, medianGreaterHalf] = this.getMedian(greaterHalf);

        return [medianLowerHalf, median, medianGreaterHalf];
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
                'height': '90px',
                'color': '#aaa',
                'fontSize': '12px',
                'font': '13px/1.4 Helvetica'
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
                'border': '1px solid white',
            }
        };
    }
});


module.exports = App;

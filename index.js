require('babel/register');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ContributionsGrid = require('./src/ui/grid');
var CommitsFetcher = require('./src/jobs/commits-fetcher');
var TimelineGenerator = require('./src/data/timeline-generator');
require('dotenv').load({path: process.cwd() + '/.env'});

module.exports = {
    getStaticMarkup: function() {
        var _contributions = require(process.cwd() + '/' + process.env.JSON_FILENAME + '.json');
        return ReactDOMServer.renderToStaticMarkup(React.createElement(ContributionsGrid, {contributions: _contributions}));
    },
    fetchContributions: CommitsFetcher.run,
    getContributionsTimeline: TimelineGenerator.generateCommitsTimeline
};

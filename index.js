require('babel/register');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ContributionsGrid = require('./src/ui/grid');
var CommitsFetcher = require('./src/jobs/commits-fetcher');
var TimelineGenerator = require('./src/data/timeline-generator');


var bitbucketCommitsFetcher = require('./src/data/bitbucket-commits-fetcher');

module.exports = {
    getStaticMarkup: function() {ReactDOMServer.renderToStaticMarkup(React.createElement(ContributionsGrid));},
    fetchContributions: CommitsFetcher.run,
    getContributionsTimeline: TimelineGenerator.generateCommitsTimeline
};

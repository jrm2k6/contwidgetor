var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var contwidgetorUi = require('contwidgetor-ui');
var ContributionsGrid = contwidgetorUi.ContributionsGrid;
var NoContributionsGrid = contwidgetorUi.NoContributionsGrid;
var CommitsFetcher = require('./jobs/commits-fetcher');
var TimelineGenerator = require('./data/timeline-generator');

require('dotenv').load({path: process.cwd() + '/.env'});

module.exports = {
    getContributionsGridWidget: function() {
          var PATH_CONTRIBUTIONS_JSON = process.cwd() + '/' + process.env.JSON_FILENAME + '.json'
          try {
              var fileStats = fs.statSync(PATH_CONTRIBUTIONS_JSON);
              var _contributions = require(PATH_CONTRIBUTIONS_JSON);
              return ReactDOMServer.renderToString(React.createElement(ContributionsGrid, {contributions: _contributions}));
          } catch (_) {
            return ReactDOMServer.renderToString(React.createElement(NoContributionsGrid));
          }
    },
    fetchContributions: CommitsFetcher.run,
    getContributionsTimeline: TimelineGenerator.generateCommitsTimeline
};

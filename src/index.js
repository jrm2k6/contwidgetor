var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ContributionsGrid = require('./ui/grid');
var NoContributionsGrid = require('./ui/no-contributions-grid');
var CommitsFetcher = require('./jobs/commits-fetcher');
var TimelineGenerator = require('./data/timeline-generator');

require('dotenv').load({path: process.cwd() + '/.env'});

module.exports = {
    getStaticMarkup: function() {
          var PATH_CONTRIBUTIONS_JSON = process.cwd() + '/' + process.env.JSON_FILENAME + '.json'
          try {
              var fileStats = fs.statSync(PATH_CONTRIBUTIONS_JSON);
              var _contributions = require(PATH_CONTRIBUTIONS_JSON);
              return ReactDOMServer.renderToStaticMarkup(React.createElement(ContributionsGrid, {contributions: _contributions}));
          } catch (_) {
            return ReactDOMServer.renderToStaticMarkup(React.createElement(NoContributionsGrid));
          }
    },
    fetchContributions: CommitsFetcher.run,
    getContributionsTimeline: TimelineGenerator.generateCommitsTimeline
};

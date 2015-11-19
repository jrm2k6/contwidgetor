var fs = require('fs');
var appRoot = require('app-root-path');
var timelineUtils = require('../utils/timeline-utils');

require('dotenv').load({path: appRoot + '/.env'});

var generateCommitsTimeline = function() {
    var db = require('../db/content-provider');
    db.loadDatabase({}, function() {
        var outputFilename = process.env.JSON_FILENAME + '.json';
        var commits = db.getCollection('commits');
        var githubCommits = timelineUtils.getCommitsPerDay(commits, 'github');
        var bitbucketCommits = timelineUtils.getCommitsPerDay(commits, 'bitbucket');
        var allCommits = githubCommits.concat(bitbucketCommits);

        var sortedCommitsByDate = allCommits.sort(function(first, second) {
            return new Date(first.date) - new Date(second.date);
        });

        var jsonData = sortedCommitsByDate.reduce(function(acc, item) {
            var currentDate = item.date;
            if (acc[currentDate] != null) {
                acc[currentDate] += item.num_commits;
            } else {
                acc[currentDate] = item.num_commits;
            }

            return acc;
        }, {});

        fs.writeFileSync(outputFilename, JSON.stringify(jsonData));
    });
}

module.exports = {
    generateCommitsTimeline: generateCommitsTimeline
};

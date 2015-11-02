var fs = require('fs');

var db = require('../src/db/content-provider');
var timelineUtils = require('../src/utils/timeline-utils');

var generateTimelineCommits: function(outputFilename) {
    db.loadDatabase({}, function() {
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
    generateTimelineCommits: generateTimelineCommits
};

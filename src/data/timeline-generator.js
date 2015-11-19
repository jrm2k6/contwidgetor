var fs = require('fs');
var timelineUtils = require('../utils/timeline-utils');

require('dotenv').load({path: process.cwd() + '/.env'});

var generateCommitsTimeline = function() {
    let afterDbLoaded = () => {
        var db = require('../db/content-provider').getDB();
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
    };

    const ContentProvider = require('../db/content-provider');
    ContentProvider.createOrLoadDatabase(afterDbLoaded);
}

module.exports = {
    generateCommitsTimeline: generateCommitsTimeline
};

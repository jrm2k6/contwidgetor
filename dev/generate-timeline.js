var fs = require('fs');

var db = require('../src/db/content-provider');
var timelineUtils = require('../src/utils/timeline-utils');

db.loadDatabase({}, function() {
    var commits = db.getCollection('commits');
    var githubCommits = timelineUtils.getCommitsPerDay(commits, 'github');
    var bitbucketCommits = timelineUtils.getCommitsPerDay(commits, 'bitbucket');
    var allCommits = githubCommits.concat(bitbucketCommits);

    var jsonData = allCommits.reduce(function(acc, item) {
        var currentDate = item.date;
        if (acc[currentDate] != null) {
            acc[currentDate] += item.num_commits;
        } else {
            acc[currentDate] = item.num_commits;
        }

        return acc;
    }, {});

    fs.writeFileSync('dummy-data.json', JSON.stringify(jsonData));
});

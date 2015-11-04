var CronJob = require('cron').CronJob;
var async = require('async')
var bitbucketOAuth = require('../data/bitbucket-oauth');
var githubAuth = require('../data/github-auth');

var updateContributionsDaily = function() {
    new CronJob('* * * * * *', function() {
        async.series([
            bitbucketOAuth.fetchContributionsOnBitbucket(),
            githubAuth.fetchContributionsOnGithub()
        ]);
    }, function() {
        console.log('Contributions updated!');
    }, true, 'America/Los_Angeles');
}

updateContributionsDaily();

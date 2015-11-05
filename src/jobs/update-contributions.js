var CronJob = require('cron').CronJob;
var commitsFetcher = require('./commits-fetcher');

var updateContributionsDaily = function() {
    new CronJob('0 0 * * * *', function() {
            commitsFetcher.run();
    }, function() {
        console.log('Contributions updated!');
    }, true, 'America/Los_Angeles');
}

updateContributionsDaily();

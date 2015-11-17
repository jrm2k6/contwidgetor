var bitbucketCommitsFetcher = require('../data/bitbucket-commits-fetcher');
var githubCommitsFetcher = require('../data/github-commits-fetcher');

var run = function() {
    bitbucketCommitsFetcher.run(githubCommitsFetcher.run);
}

module.exports = {
    run: run
};

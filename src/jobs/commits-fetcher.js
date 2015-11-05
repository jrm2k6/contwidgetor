var bitbucketCommitsFetcher = require('../data/bitbucket-commits-fetcher');
var githubCommitsFetcher = require('../data/github-commits-fetcher');

var run = function() {
    bitbucketCommitsFetcher.run(githubAuth.run);
}

module.exports = {
    run: run
};

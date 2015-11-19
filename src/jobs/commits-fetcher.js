var bitbucketCommitsFetcher = require('../data/bitbucket-commits-fetcher');
var githubCommitsFetcher = require('../data/github-commits-fetcher');

let run = () => {
    const ContentProvider = require('../db/content-provider');
    const afterDbLoaded = () => {
        bitbucketCommitsFetcher.run(githubCommitsFetcher.run);
    }

    ContentProvider.createOrLoadDatabase(afterDbLoaded);
}

module.exports = {
    run: run
};

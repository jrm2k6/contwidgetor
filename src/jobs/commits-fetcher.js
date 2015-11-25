import bitbucketCommitsFetcher from '../data/bitbucket-commits-fetcher';
import githubCommitsFetcher from '../data/github-commits-fetcher';

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

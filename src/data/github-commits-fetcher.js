var _     = require('lodash');
var async = require('async');
var request = require('request');
var timelineUtils = require('../utils/timeline-utils');

require('dotenv').load({path: process.cwd() + '/.env'});

var db = null;
var repositoriesCollection = null;
var commitsCollection = null;

var run = function() {
    db = require('../db/content-provider').getDB();
    var options = getRequestOptions('https://api.github.com/users/' + process.env.GITHUB_USERNAME);

    request(options,
        function (err, res, body) {
            if (err) {
                console.log(err);
            }

            var data = JSON.parse(body);
            var urlRepos = data['repos_url'];

            if (urlRepos) {
                fetchAllReposUser(urlRepos);
            }
        }
    );
};

var fetchAllReposUser = function(_urlRepos) {
    var urlRepos = _urlRepos + '?per_page=100&page='
    getReposForPage(urlRepos, 1, [], function(data) {
        getCommitsRepoUrlsGithub(data);
    });
}

var getReposForPage = function(_urlRepos, indexPage, finalRes, callback) {
    var urlRepos = _urlRepos + indexPage;
    var options = getRequestOptions(urlRepos);

    request(options, function(err, res, body) {
        if (err) {
            console.log('error', err);
            return callback(finalRes);
        }

        var data = JSON.parse(body);
        if (data.length > 0) {
            var _res = finalRes.concat(data);
            return getReposForPage(_urlRepos, indexPage+1, _res, callback);
        } else {
            return callback(finalRes);
        }
    });
}

var getCommitsRepoUrlsGithub = function(data) {
    repositoriesCollection = db.getCollection('repositories');
    var commitsRepoUrls = _.forEach(data, function(item) {
        var commitsUrl = item['git_commits_url'].split('{')[0];
        repositoriesCollection.insert({uri: commitsUrl});
    });

    var fcts = _.map(data, function(item) {
        return function(callback) {
            getCommitsRepos(item['commits_url'].split('{')[0] + '?per_page=100&page=', callback);
        }
    });

    async.parallel(fcts, function(err, res) {
        if (err) {
            console.log(err);
        }

        db.saveDatabase();
    });
};

var getCommitsRepos = function(uri, callback) {
    getCommitsReposForPage(uri, 1, callback);
};

var getCommitsReposForPage = function(uri, indexPage, callback) {
    var paginatedUri = uri + indexPage;
    var options = getRequestOptions(paginatedUri);

    request(options, function(err, res, body) {
        if (err) {
            console.log(err);
        }

        var dataAsJson = JSON.parse(body);
        if (dataAsJson.length > 0) {
            addCommitsToCollection(dataAsJson, uri);
            getCommitsReposForPage(uri, indexPage+1, callback);
        } else {
            callback(null, uri);
        }
    });
}

var addCommitsToCollection = function(dataAsJson, uri) {
    commitsCollection = db.getCollection('commits');

    _.forEach(dataAsJson, function(item) {
        if (item['author'] && item['author']['login'] === process.env.GITHUB_USERNAME) {
            var _node = item['sha'];
            var _timestamp = item['commit']['committer']['date'];
            commitsCollection.insert({node: _node, timestamp: _timestamp, uri: uri, provider: 'github'});
        }
    });
}

var getRequestOptions = function(_url) {
    return {
        url: _url,
        headers: {
            'User-Agent': process.env.GITHUB_USERNAME,
            'Authorization': 'token ' + process.env.GITHUB_ACCESS_TOKEN
        },
        method: 'GET'
    };
};

module.exports = {
    run: run
}

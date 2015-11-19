var oauth = require('oauth');
var _     = require('lodash');
var async = require('async');
var appRoot = require('app-root-path');

var db = require('../db/content-provider');

require('dotenv').load({path: appRoot + '/.env'});

var _oauth = new oauth.OAuth(
    null,
    null,
    process.env.CONSUMER_KEY_BITBUCKET,
    process.env.CONSUMER_SECRET_BITBUCKET,
    '1.0',
    null,
    'HMAC-SHA1'
);

var run = function(githubAuthCallback) {
    _oauth.get(
        'https://bitbucket.org/api/2.0/repositories/' + process.env.BITBUCKET_USERNAME,
        null,
        null,
        function(err, data, res) {
            if (err) {
                console.log(err);
            }

            var asJson = JSON.parse(data);
            var teams = asJson['values'];
            var hrefs = _.map(teams, function(item) {
                return item['links']['commits']['href'];
            });

            _.forEach(hrefs, function(item) {
                repositoriesCollection.insert({uri: item});
            });

            fetchUrlCommitsReposForTeams(githubAuthCallback);
        }
    );
}

var fetchUrlCommitsReposForTeams = function(githubAuthCallback) {
    _oauth.get(
        'https://api.bitbucket.org/2.0/teams/?role=member',
        null,
        null,
        function(err, data, res) {
            if (err) {
                console.log(err);
            }

            var asJson = JSON.parse(data);
            var teams = asJson['values'];
            var nbTeamsToCheck = teams.length;
            var hrefs = _.map(teams, function(item) {
                return item['links']['repositories']['href'];
            });

            var fcts = _.map(hrefs, function(item) {
                return function(callback) {
                    getReposTeams(item, callback);
                }
            });

            async.parallel(fcts, function(err, res) {
                if (err) {
                    console.log(err);
                }

                getCommitsRepos(githubAuthCallback);
            });
        }
    );
}

var getReposTeams = function(url, callback) {
    _oauth.get(
        url,
        null,
        null,
        function(err, data, res) {
            if (err) {
                callback(err, null);
            }
            var values = JSON.parse(data)['values'];
            var links = _.forEach(values, function(item) {
                var uriCommits = item['links']['commits']['href'];
                repositoriesCollection.insert({uri: uriCommits});
            });

            callback(null, links);
        }
    );
}


var getCommitsRepos = function(githubAuthCallback) {
    var repos = repositoriesCollection.where(function(item) {
        return item.uri !== null;
    });

    var fcts = _.map(repos, function(item) {
        return function(callback) {
            getCommits(item.uri, callback);
        }
    });

    async.parallel(fcts, function(err, res) {
        if (err) {
            console.log(err);
        }

        db.saveDatabase();
        githubAuthCallback();
    });
}


var getCommits = function(_uri, callback) {
    _oauth.get(
        _uri,
        null,
        null,
        function(err, data, res) {
            if (err) {
                callback(err, null);
            }

            var asJson = JSON.parse(data);
            var commits = asJson['values'];
            var _commits = _.forEach(commits, function(elem) {
                var author = elem['author']['user'];
                if (author && author['username'] === process.env.BITBUCKET_USERNAME) {
                    commitsCollection.insert({node: elem['hash'], timestamp: elem['date'], uri: _uri, provider: 'bitbucket'});
                }
            });

            callback(null, _uri);
        }
    );
}

module.exports = {
    run: run
}

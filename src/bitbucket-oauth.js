var oauth = require('oauth');
var _     = require('lodash');
var async = require('async');
var db = require('./db/content-provider');

require('dotenv').load();

var _oauth = new oauth.OAuth(
    null,
    null,
    process.env.CONSUMER_KEY_BITBUCKET,
    process.env.CONSUMER_SECRET_BITBUCKET,
    '1.0',
    null,
    'HMAC-SHA1'
);

_oauth.get(
    'https://bitbucket.org/api/2.0/repositories/jrm2k6',
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

        fetchUrlCommitsReposForTeams();
    }
);

var fetchUrlCommitsReposForTeams = function() {
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

                getCommitsRepos();
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
                console.log(err);
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


var getCommitsRepos = function() {
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
        getCommitsPerDay();
    });
}


var getCommits = function(_uri, callback) {
    _oauth.get(
        _uri,
        null,
        null,
        function(err, data, res) {
            if (err) {
                console.log(err);
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

var getCommitsPerDay = function() {
    var mapTimestamp = function(obj) {
        return obj.timestamp;
    };

    var reduceToSameDay = function(timestamps) {
        return _.groupBy(timestamps, function(timestamp) {
            return timestamp.split('T')[0];
        });
    }

    commitsPerDay = commitsCollection.mapReduce(mapTimestamp, reduceToSameDay);
    return _.map(commitsPerDay, function(item, key) {
        return {'date': key, 'num_commits': item.length};
    });
}

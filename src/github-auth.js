var _     = require('lodash');
var loki  = require('lokijs');
var async = require('async');
var request = require('request');

require('dotenv').load();

var repositoriesCollection = null;
var commitsCollection = null;

var db = new loki('contributions',  {
    persistenceMethod: 'fs',
    autoload: true,
    autoloadCallback: loadHandler
});

function loadHandler() {
    repositoriesCollection = db.getCollection('repositories');

    if (repositoriesCollection === null) {
        repositoriesCollection = db.addCollection('repositories', {indices: ['uri']});
        commitsCollection = db.addCollection('commits', {indices: ['node', 'uri', 'timestamp']});
    } else {
        commitsCollection = db.getCollection('commits');
    }
}

var getUserRepos = function() {
    var options = getRequestOptions('https://api.github.com/users/' + process.env.GITHUB_USERNAME);

    request(options,
        function (err, res, body) {
            if (err) {
                console.log('error', err);
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

    // var options = getRequestOptions(urlRepos);
    // request(options, function(err, res, body) {
    //     if (err) {
    //         console.log('error', err);
    //     }
    //
    //     var data = JSON.parse(body);
    // });


    // getCommitsReposGithub(data);
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
    var commitsRepoUrls = _.forEach(data, function(item) {
        var commitsUrl = item['git_commits_url'].split('{')[0];
        repositoriesCollection.insert({uri: commitsUrl});
    });

    var fcts = _.map(data, function(item) {
        return function(callback) {
            getCommitsRepos(item['commits_url'].split('{')[0] + '?per_page=100&page=', callback);
        }
    });

    // getCommitsRepos(data[19]['commits_url'].split('{')[0] + '?per_page=100&page=', callback);


    async.parallel(fcts, function(err, res) {
        if (err) {
            console.log(err);
        }

        console.log(res);
    });
};

getCommitsRepos = function(uri, callback) {
    getCommitsReposForPage(uri, 1, callback);
};

getCommitsReposForPage = function(uri, indexPage, callback) {
    var paginatedUri = uri + indexPage;
    var options = getRequestOptions(paginatedUri);

    request(options, function(err, res, body) {
        if (err) {
            console.log(err);
        }

        var dataAsJson = JSON.parse(body);
        if (dataAsJson.length > 0) {
            getCommitsReposForPage(uri, indexPage+1, callback);
        } else {
            console.log('done');
            callback(null, uri);
        }
    });
}

var getRequestOptions = function(_url) {
    console.log(_url);
    return {
        url: _url,
        headers: {
            'User-Agent': process.env.GITHUB_USERNAME,
            'Authorization': 'token ' + process.env.GITHUB_ACCESS_TOKEN
        },
        method: 'GET'
    };
};


getUserRepos();

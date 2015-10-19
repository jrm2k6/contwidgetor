var _     = require('lodash');

var getCommitsPerDay = function(_commitsCollection, _provider) {
    var commitsForProvider = _commitsCollection.where(function(item) {
        return item.provider === _provider;
    });

    var commitsPerDay = _.chain(commitsForProvider).map(function(item) {
        return item.timestamp;
    }).groupBy(function(item) {
        return item.split('T')[0];
    }).map(function(item, key) {
        return {'date': key, 'num_commits': item.length};
    }).value();

    return commitsPerDay;
}

module.exports = {
    getCommitsPerDay: getCommitsPerDay
}

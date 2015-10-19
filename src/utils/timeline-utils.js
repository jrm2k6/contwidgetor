var _     = require('lodash');

    var mapTimestamp = function(obj) {
        return obj.timestamp;
    };

    var reduceToSameDay = function(timestamps) {
        return _.groupBy(timestamps, function(timestamp) {
            return timestamp.split('T')[0];
        });
    }
var getCommitsPerDay = function(_commitsCollection, _provider) {

    commitsPerDay = _commitsCollection.mapReduce(mapTimestamp, reduceToSameDay);
    return _.map(commitsPerDay, function(item, key) {
        return {'date': key, 'num_commits': item.length};
    });
}

module.exports = {
    getCommitsPerDay: getCommitsPerDay
}

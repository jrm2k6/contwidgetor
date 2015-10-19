var _     = require('lodash');

var getCommitsPerDay = function(_commitsCollection) {
    var mapTimestamp = function(obj) {
        return obj.timestamp;
    };

    var reduceToSameDay = function(timestamps) {
        return _.groupBy(timestamps, function(timestamp) {
            return timestamp.split('T')[0];
        });
    }

    commitsPerDay = _commitsCollection.mapReduce(mapTimestamp, reduceToSameDay);
    return _.map(commitsPerDay, function(item, key) {
        return {'date': key, 'num_commits': item.length};
    });
}

module.exports = {
    getCommitsPerDay: getCommitsPerDay
}

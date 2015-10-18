var loki  = require('lokijs');

var db = new loki('contributions.json',  {
    persistenceMethod: 'fs',
    autoload: true,
    autoloadCallback: loadHandler
});

function loadHandler() {
    repositoriesCollection = db.getCollection('repositories');

    if (repositoriesCollection === null) {
        repositoriesCollection = db.addCollection('repositories', {indices: ['uri']});
        commitsCollection = db.addCollection('commits', {indices: ['node', 'uri', 'timestamp', 'provider']});
    } else {
        commitsCollection = db.getCollection('commits');
    }
}

module.exports = db;

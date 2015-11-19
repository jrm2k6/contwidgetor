var loki  = require('lokijs');
var db;

let createOrLoadDatabase = (callback) => {
    db = new loki('contributions.json',  {
        persistenceMethod: 'fs',
        autoload: true,
        autoloadCallback: loadHandler
    });

    function loadHandler() {
        var repositoriesCollection = db.getCollection('repositories');
        var commitsCollection = null;

        if (repositoriesCollection === null) {
            repositoriesCollection = db.addCollection('repositories', {indices: ['uri']});
            commitsCollection = db.addCollection('commits', {indices: ['node', 'uri', 'timestamp', 'provider']});
        } else {
            commitsCollection = db.getCollection('commits');
        }

        callback();
    }
}


let getDB = () => db;

module.exports = {
    createOrLoadDatabase: createOrLoadDatabase,
    getDB: getDB
};

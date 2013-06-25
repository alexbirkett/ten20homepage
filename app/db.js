var MongoClient = require('mongodb').MongoClient;

var dbs = {};

module.exports = function(callback) {

    MongoClient.connect('mongodb://localhost/ten20home', function(err, db) {

        if(err) throw err;

        console.log('mongodb connected...');

        dbs['contact'] = db.collection('contact');

        callback(dbs);
        })
};

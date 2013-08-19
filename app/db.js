var MongoClient = require('mongodb').MongoClient;

var dbs = {};

module.exports = function(callback) {

    MongoClient.connect('mongodb://localhost/ten20home', function(err, db) {

        console.log('mongodb connected...');

        dbs['contact'] = db.collection('contact');
        dbs['user'] = db.collection('user');

        callback(err, dbs);
   });
};

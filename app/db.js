var MongoClient = require('mongodb').MongoClient;

var dbs = {};

module.exports = function(callback) {

    MongoClient.connect('mongodb://localhost/ten20home', function(err, db) {

        if(err) {
          console.error('connect to mongodb failed, app exits!');
          process.exit(0);
        }

        console.log('mongodb connected...');

        dbs['contact'] = db.collection('contact');
        dbs['user'] = db.collection('user');

        callback(dbs);
   });
};

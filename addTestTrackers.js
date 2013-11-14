var optimist = require('optimist');
var argv = optimist.usage('Usage: $0  --email [string] --password [string] --url [string]').
    options('e', {
        alias : 'email',
        describe: 'email address'
    }).
    options('p', {
        alias : 'password',
        describe: 'https listening port'
    }).
    options('u', {
        alias : 'url',
        describe: 'url'
    })
    .demand(['e','p','u']).argv;


var requestApi = require('request');
var request = requestApi.defaults({followRedirect: false, jar: requestApi.jar()});
var async = require('async');

var trackers = [
    {
        "name": "Xiaolei",
        "iconEmail": "alex@birkett.no",
        "iconColor": "FF00FF",
        "serial": "14234234234", // device serial number
        "lastUpdateTimestamp": (new Date()).valueOf(),
        "fence": "on 5km", // on *km, off
        "latitude": 52.80113,
        "longitude": -1.63130,
        "speed": "20", // km/h
        "course": "359", // degrees
        "gpsAvailable": true
    },
    {
        "name": "Alex",
        "iconEmail": "alex@birkett.no",
        "iconColor": "FF00FF",
        "serial": "24234234235", // device serial number
        "lastUpdateTimestamp": (new Date()).valueOf(),
        "fence": "off", // on *km, off
        "latitude": 52.80323,
        "longitude": -1.61930,
        "speed": "10", // km/h
        "course": "13", // degrees
        "gpsAvailable": true
    }
];

var url = argv.url;

async.waterfall([

    function (callback) {

        var credential = {
            email: argv.email,
            password: argv.password
        };

        request.post({url: url + '/signin', json: credential}, callback);
    },
    function (response, body, callback) {
       console.log('signin response ' + response.statusCode);
        if (response.statusCode === 200) {
            request.put({url: url + '/trackers', json: trackers }, callback);
        } else {
            callback('invalid username and password');
        }
    },
    function(response, body) {
       console.log('put trackers response ' + response.statusCode);
    }
    ],
    function (err) {
        if (err) {
            console.log(err);
        }
    });




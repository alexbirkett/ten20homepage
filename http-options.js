var fs = require('fs');

var argv = require('optimist').
  usage('Usage: $0 -p [num] -ps [num] -c [string] -k [strig] [http-only]').
  options('p', {
    alias : 'http-port',
    default : 3000,
    describe: 'http listening port'
  }).
  options('s', {
    alias : 'https-port',
    default : 4433,
    describe: 'https listening port'
  }).
  options('c', {
    alias : 'certificate',
    default : 'keys/cert.pem',
    describe: 'https certificate'
  }).
  options('k', {
    alias : 'key',
    default : 'keys/key.pem',
    describe: 'https key'
  }).
  options('O', {
    alias : 'only-http',
    describe: 'only serve http'
  }).argv;


var options = { http: {}, https: {}};

options.http.port = argv.p;
options.http.only = !!argv.O;

if (!options.http.only) {
  try {
    options.https.port = argv.s;
    options.https.key = fs.readFileSync(argv.k).toString();
    options.https.cert = fs.readFileSync(argv.c).toString();
  } catch (e) {
    console.log("can't find key and or cert");
    options.https = undefined;
  }
} else {
    options.https = undefined;
}

module.exports = options;

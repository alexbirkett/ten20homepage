var fs = require('fs');
var optimist = require('optimist');

var argv = optimist.usage('Usage: $0 -p [num] -s [num] -c [string] -k [string] -O').
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
  }).
  options('h', {
    alias : 'help',
    describe: 'show help'
  }).argv;


var options = { http: {}, https: {}};

if (argv.h) {
  optimist.showHelp();
  process.exit(0);
}

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

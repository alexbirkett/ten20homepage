var fs = require('fs');
var optimist = require('optimist');
var path = require('path');
var root = path.dirname(__dirname);

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
    default : path.join(root, 'cert.pem'),
    describe: 'https certificate'
  }).
  options('k', {
    alias : 'key',
    default : path.join(root, 'key.pem') ,
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

var keyFile = argv.k.trim();
var certFile = argv.c.trim();
if (!options.http.only) {
  try {
    options.https.port = argv.s;
    options.https.key = fs.readFileSync(keyFile).toString();
    options.https.cert = fs.readFileSync(certFile).toString();
  } catch (e) {
    console.log("can't find key (" + keyFile + ") and or cert (" + certFile + ")");
    options.https = undefined;
    process.exit(1);
  }
} else {
  options.https = undefined;
}

module.exports = options;

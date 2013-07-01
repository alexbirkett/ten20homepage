var fs = require('fs');

var options = {};

try {
    options.key = fs.readFileSync('./certs/key.pem').toString();
    options.cert = fs.readFileSync('./certs/cert.pem').toString();
} catch (e) {
    console.log("can't find key and or cert");
    options = undefined;
}

module.exports = options;

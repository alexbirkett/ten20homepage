var fs = require('fs');

var options = {};

try {
    options.key = fs.readFileSync(process.env.KEY).toString();
    options.cert = fs.readFileSync(process.env.CERT).toString();
} catch (e) {
    console.log("can't find key and or cert");
    options = undefined;
}

module.exports = options;

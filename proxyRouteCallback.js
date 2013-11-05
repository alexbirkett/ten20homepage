var http = require('http');

var request = require('request');
var httpProxy = require('http-proxy');
var proxy = new httpProxy.RoutingProxy();

var proxyOptions = {
    host: 'localhost',
    port: 3001
};

var routesToForward = [
    { path: '/trackers' },
    { path: '/signup', method: 'POST' },
    { path: '/user'},
    { path: '/signin' },
    { path: '/signout'}

];

module.exports = function(req, res, next) {

    var forward = false;
    for (var i = 0; i < routesToForward.length; i++) {
        var route = routesToForward[i];
        if (req.url.indexOf(route.path) === 0 && (!route.method || route.method === req.method)) {
           forward = true;
           break;
        }
    }
    if(forward) {
        return proxy.proxyRequest(req, res, proxyOptions);
    } else {
        next();
    }
};
var express = require('express');
var http = require('http');
var https = require('https');
var connect = require('connect');
var routes = require('./app/routes');
var poet = require('./app/routes/poet');
var options = require('./app/http-options');
var httpProxy = require('http-proxy');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

var app = express();

// Configuration
function removeWWW(req, res, next) {
    var host = req.get('host');
    if (host.indexOf('www.') === 0) {
        var redirectUrl = 'https://' + host.slice(4) + req.url;
        return res.redirect(redirectUrl);
    }
    next();
}

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

var apiEndpoints = [
    { path: '/trackers' },
    { path: '/signup', method: 'POST' },
    { path: '/user'},
    { path: '/authenticate' },
    { path: '/signout'},
    { path: '/message' },
    { path: '/reset_password'},
    { path: '/trips'},
    { path: '/recent_messages'},
    { path: '/protocols'}
];

var proxy = new httpProxy.createProxyServer({target: options.apiUrl });

function forwardApiRequest(req, res, next) {

    var forward = false;
    for (var i = 0; i < apiEndpoints.length; i++) {
        var route = apiEndpoints[i];
        if (req.url.indexOf(route.path) === 0 && (!route.method || route.method === req.method)) {
            forward = true;
            break;
        }
    }
    if(forward) {
        return proxy.web(req, res);
    } else {
        next();
    }
};

var server = require('http').createServer(app).listen(options.http.port);
console.log('http listening on ' + options.http.port);

if (options.https) {
    server = https.createServer(options.https, app).listen(options.https.port);
    console.log('https listening on ' + options.https.port);
}

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(removeWWW);
if (options.https) {
  app.use(requireHTTPS);
}
app.use(logger('dev'));
app.use(forwardApiRequest);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// init poet routes and configs
poet(app);

// user console
app.get('/console', routes.console);

app.get('/features', function(req, res) {
    res.json({"adFree": true});
});

app.get(/\/\w?/, routes.index);

module.exports = app;


//require('ten20location.io'); // start ten20 LocationIO adapter

var express = require('express'),
    http = require('http'),
    https = require('https'),
    connect = require('connect')
    routes = require('./app/routes'),
    poet = require('./app/routes/poet'),
    options = require('./app/http-options'),
    configureDryRoutes = require('express-dry-router'),
    httpProxy = require('http-proxy');

var app = module.exports = express();

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
app.use(forwardApiRequest);
app.use(connect.compress());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(app.router);

if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if ('production' == app.get('env')) {
    app.use(express.errorHandler());
}

// init poet routes and configs
var poetInst = poet(app);

app.get('/blog-rss', function (req, res) {
  // Only get the latest posts
  var posts = poetInst.helpers.getPosts(0, 7);
  res.setHeader('Content-Type', 'text/rss+xml');
  res.render('posts/rss', { posts: posts });
});
// user console
app.get('/console', routes.console);

app.get('/features', function(req, res) {
    res.json({"adFree": true});
});

app.get(/\/\w?/, routes.index);



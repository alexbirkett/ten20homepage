//require('ten20location.io'); // start ten20 LocationIO adapter

var express = require('express'),
    http = require('http'),
    https = require('https'),
    connect = require('connect')
    routes = require('./app/routes'),
    admin = require('./app/routes/admin'),
    options = require('./app/http-options'),
    configureDryRoutes = require('express-dry-router'),
    RedisStore = require('connect-redis')(express),
    MongoClient = require('mongodb').MongoClient,
    httpProxy = require('http-proxy');


// redis connection detect
var redis = new RedisStore();
var app = module.exports = express();

redis.client.on('error', function() {
  console.error('connect to redis failed, app exits!');
  process.exit(0);
});

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
    { path: '/signin' },
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

var dbName = 'development' === app.get('env') ? 'ten20homeDevelopment' : 'ten20home';

MongoClient.connect('mongodb://localhost/' + dbName, function(err, db) {

    if(err) {
        console.error('connect to mongodb failed, app exits!');
        process.exit(0);
    }

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
    app.use(express.cookieParser('&*(j#$84nui$%'));
    app.use(express.session({
        store: redis,
        secret: '1234567890QWERTY',
        key: 'hs'
    }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use('/admin', admin.authenticateMiddleware);
    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }

    if ('production' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // admin console
    configureDryRoutes(admin, app);

    // user console
    app.get('/signup', routes.signup);
    app.get('/console', routes.console);
    // home page
    app.post('/contact', routes.contact);
    app.get(/\/\w?/, routes.index);

    routes.setDb(db);
    admin.setDb(db);

});

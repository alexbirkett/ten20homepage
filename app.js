//require('ten20location.io'); // start ten20 LocationIO adapter

var express = require('express'),
    http = require('http'),
    https = require('https'),
    connect = require('connect')
    routes = require('./app/routes'),
    user = require('./app/routes/user'),
    admin = require('./app/routes/admin'),
    pass = require('./app/pass'),
    passport = require('passport'),
    options = require('./app/http-options'),
    configureApi = require('ten20api'),
    configureDryRoutes = require('express-dry-router'),
    RedisStore = require('connect-redis')(express),
    MongoClient = require('mongodb').MongoClient;

// redis connection detect
var redis = new RedisStore();
var db = {};

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

MongoClient.connect('mongodb://localhost/ten20home', function(err, mongoDb) {


    db['contact'] = mongoDb.collection('contact');
    db['user'] = mongoDb.collection('user');

    if(err) {
        console.error('connect to mongodb failed, app exits!');
        process.exit(0);
    }

    var app = module.exports = express();
    var server = require('http').createServer(app).listen(options.http.port);
    console.log('http listening on ' + options.http.port);

    if (options.https) {
        server = https.createServer(options.https, app).listen(options.https.port);
        console.log('https listening on ' + options.https.port);
    }

    var io = require('socket.io').listen(server);

    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'jade');
    app.use(removeWWW);
    if (options.https) {
      app.use(requireHTTPS);
    }
    app.use(connect.compress());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('&*(j#$84nui$%'));
    app.use(express.session({
    store: redis,
    secret: '1234567890QWERTY'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use('/admin', admin.authenticateMiddleware);
    app.use('/user', pass.ensureAuthenticated);
    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }

    if ('production' == app.get('env')) {
        app.use(express.errorHandler());
    };

    // attach api to home page app
    configureApi(app, io);

    // admin console
    configureDryRoutes(admin, app);

    configureDryRoutes(user.console, app);

    // user console
    app.get('/signup', routes.signup);
    app.get('/user', routes.user);
    // home page
    app.post('/contact', routes.contact);
    app.get(/\/\w?/, routes.index);

    routes.setDb(db);
    admin.setDb(db);
    user.setDb(db);
    pass.setDb(db);
});

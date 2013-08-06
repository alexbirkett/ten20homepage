
var express = require('express'),
    http = require('http'),
    https = require('https'),
    connect = require('connect')
    routes = require('./app/routes'),
    user = require('./app/routes/user'),
    api = require('./app/routes/api'),
    dbs = require('./app/db'),
    pass = require('./app/pass'),
    passport = require('passport'),
    options = require('./app/http-options'),
    configureApi = require('ten20api'),
    RedisStore = require('connect-redis')(express);



var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// Configuration

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  if (options.https) {
      app.use(requireHTTPS);
  }
  app.use(connect.compress());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('&*(j#$84nui$%'));
  app.use(express.session({
    store: new RedisStore(),
    secret: '1234567890QWERTY'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


configureApi(app);

// admin console
app.get('/admin/login', routes.admin.login);
app.post('/admin/login', routes.admin.signin);
app.get('/admin/data', routes.admin.data);
app.get('/admin', routes.admin.console);

// user console
app.post('/signup', user.signup);
app.get('/user', pass.ensureAuthenticated, user.dashboard);
app.post('/signin', user.signin);
app.get('/signout', user.signout);

// home page
app.post('/contact', routes.contact);
app.get(/\/\w?/, routes.index);


// Socket.io Communication
io.sockets.on('connection', require('./app/routes/socket'));

dbs(function(db) {
    routes.setDb(db);
    user.setDb(db);
    pass.setDb(db);

    if (options.https) {
        https.createServer(options.https, app).listen(options.https.port);
        console.log('https listening on ' + options.https.port);
    }
    http.createServer(app).listen(options.http.port);
    console.log('http listening on ' + options.http.port);
});


/**
 * Module dependencies.
 */
require('nodetime').profile({
    accountKey: 'e471874f4f721e3103e7d6a420f27dedebf70f14',
    appName: 'ten20 homepage'
});

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    dbs = require('./app/db');
    http = require('http'),
    https = require('https'),
    options = require('./http-options');



var app = module.exports = express();

// Configuration

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  if (options) {
      app.use(requireHTTPS);
  }
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('&*(j#$84nui$%'));
  app.use(express.session());
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

// Routes

app.get(/\/\w?/, routes.index);
app.get('/partials/:name', routes.partials);
app.post('/contact', routes.form);

// JSON API
app.get('/api/name', api.name);

dbs(function(db) {
    routes.setDb(db);
    if (options) {
        https.createServer(options, app).listen(process.env.HTTPS_PORT || 4433);
    }
    http.createServer(app).listen(process.env.HTTP_PORT || 3000);
});

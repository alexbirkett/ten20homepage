
/**
 * Module dependencies.
 */
require('nodetime').profile({
    accountKey: 'e471874f4f721e3103e7d6a420f27dedebf70f14',
    appName: 'ten20 homepage'
});

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
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

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

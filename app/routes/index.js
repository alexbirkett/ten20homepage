
/*
 * GET home page.
 */

var extend = require('extend');
var indexModel = require('../data/index.json');
var contactCollection;

exports.setDb = function(db) {
  contactCollection = db.collection('contact');;
};

exports.index = function(req, res) {

  var model;

  if (req.path == '/') {
    model =  indexModel;
  } else {
    // strip out any nasties like ..
    var pattern =/([a-z_-]+)/i;
    var output = pattern.exec(req.path);

    try {
      model = require('../data/' + output[1]);
    } catch (e) {
      // ignore
    }
  }

  if (model) {
    // include file sections
    for (var i = 0; i < model.sections.length; i++) {
      var file = model.sections[i].file;
      if (file) {
        model.sections[i] = require('../data/' + file);
      }
    };

    if (!model.cookies) {
      model.cookies = indexModel.cookies;
    }

    if (req.cookies.views) {
      model.cookies.display = 'hide';
    } else {
      // set cookie
      model.cookies.display = 'show';
      // IE8 doesn't support max-age, so have to fallback to expires, though a bit older 
      if (req.secure) {
        res.cookie('views', '1', { expires: new Date(2030, 1, 1), secure: true});
      } else {
        res.cookie('views', '1', { expires: new Date(2030, 1, 1)});
      }
    }

    // set environment variable
    res.render('index', model);
  } else {
    res.status(404);
    res.render('404', {pageTitle: 'Page Not Found'});
  }
};

exports.contact = function(req, res){
  var data = req.body;

  data.date = (new Date()).toDateString();

  contactCollection.insert(data, function(error, docs) {
    res.json({error: !!error});
  });
};

exports.signup = function(req, res) {
  res.render('signup-hidden', {pageTitle: 'Sign Up | ten20live'});
};

exports.console = function (req, res) {
  res.render('console');
};

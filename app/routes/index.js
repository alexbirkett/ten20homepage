
/*
 * GET home page.
 */

var extend = require('extend');
var indexModel = require('../data/index.json');
var form = require('../data/form.json');
var forms = [];
var contactCollection;

// extend forms
var tmp = {};
for (key in form) {
  tmp = extend(true, {}, form["base-form"]);
  if (key != "base-form" ) {
    if (form[key].hasOwnProperty('extends')) {
      forms.push(extendForm(tmp, form[key]));
    } else {
      forms.push(form[key]);
    }
  }
};

function extendForm(target, source) {
  for(key in source) {
    if( Object.prototype.toString.call(source[key]) === '[object Array]' ) {
      if (target[key]) {
        target[key] = target[key].concat(source[key]);
      } else {
        target[key] = source[key];
      }
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

exports.setDb = function(db) {
    contactCollection = db.collection('contact');;
};

exports.index = function(req, res){

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
        // add forms to model
        if (!model.includeForm) {
          model.sections = model.sections.concat(forms);
          model.includeForm = true;
        }

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

    data.date = (new Date()).toDateString()

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

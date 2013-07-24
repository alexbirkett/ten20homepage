
/*
 * GET home page.
 */

var extend = require('extend');
var indexModel = require('../data/index.json');
var form = require('../data/form.json');
var config = require('../config.js');
var db = {};
var forms = [];

// extend forms
var tmp = {};
for (key in form) {
  tmp = extend(true, {}, form["base-form"]);
  if (key != "base-form") {
    forms.push(extendForm(tmp, form[key]));
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

exports.setDb = function(dbs) {
    db = dbs;
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
          res.render('404', {pageTitle: 'Page Not Found'});
      }
};

exports.form = function(req, res){
    var  data = req.param('data');

    db.contact.insert(data, function(error, docs) {
      console.log(docs[0]['first-name'] + ' inserted.');
      res.json({error: !!error});
    });
}

exports.admin =  {

  login: function (req, res) {
    res.render('login', {pageTitle: 'Login | ten20live'});
  },

  signin: function(req, res) {
    var username = req.param('username');
    var password = req.param('password');

    if (username === config.username &&
        password === config.password) {
      res.cookie('authorized', '1', { maxAge: 14*24*60*60*1000, signed: true });
      res.json({status: true});
    } else {
      res.json({status: false});
    }
  },

  console: function(req, res) {

    if (req.signedCookies.authorized) {

      db.contact.find(function(error, users) {
        if (error) {
          console.error(error.message);
          res.redirect('404');
        } else {
          res.render('console', { users: users, pageTitle: 'Admin | ten20live'});
        }
      });
    } else {
      res.redirect('/admin/login');
    }
  },
}

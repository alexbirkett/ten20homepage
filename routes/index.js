
/*
 * GET home page.
 */

var extend = require('extend');
var model = require('../public/data/model.json');
var partner = require('../public/data/partner.json');
var form = require('../public/data/form.json');
var db = require('../app/db.js')();

// extend forms
var tmp = {};
for (key in form) {
  tmp = extend(true, {}, form["base-form"]);
  if (key != "base-form") {
    model.sections.push(extendForm(tmp, form[key]));
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

exports.index = function(req, res){

      var model;

      if (req.path == '/') {
          model =  require('../public/data/model.json');
      } else {
           // strip out any nasties like ..
           var pattern =/([a-z_-]+)/i;
           var output = pattern.exec(req.path);

           try {
               model = require('../public/data/' + output[1]);
           } catch (e) {
               // ignore
           }
      }

      if (model) {
        if (req.cookies.views) {
          model.cookies.display = 'hide';
        } else {
          // set cookie
          model.cookies.display = 'show';
          res.cookie('views', '1', { maxAge: 90000000});
        }

        res.render('index', model);
      } else {
          res.render('404', {pageTitle: 'Page Not Found'});
      }
};

exports.form = function(req, res){
    var  data = req.param('data');
    db.contact.create(data, function(error, form) {
      console.log(form.first_name + ' inserted.');
      res.json({error: !!error});
    });
}

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

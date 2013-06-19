
/*
 * GET home page.
 */

var model = require('../public/data/model.json');
var partner = require('../public/data/partner.json');

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
          res.render('index', model);
      } else {
          res.render('404', {pageTitle: 'Page Not Found'});
      }
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};


/*
 * GET home page.
 */

var model = require('../public/data/model.json');
var partner = require('../public/data/partner.json');

exports.index = function(req, res){
  if (req.path == '/') {
    res.render('index.html', model);
  } else if (req.path == '/partner') {
    res.render('index.html', partner);
  } else {
    res.render('404.html');
  }
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

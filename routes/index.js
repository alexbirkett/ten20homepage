
/*
 * GET home page.
 */

var model = require('../public/data/model.json');

exports.index = function(req, res){
  res.render('index.html', model);
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

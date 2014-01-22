
/*
 * GET home page.
 */
var contactCollection;

exports.setDb = function(db) {
  contactCollection = db.collection('contact');;
};

exports.index = function(req, res) {
  var model = {};

  // set cookies
  if (req.cookies.views) {
    model.displayCookie = true;
  } else {
    // set cookie
    model.displayCookie = false;
    // IE8 doesn't support max-age, so have to fallback to expires,
    // though a bit older 
    if (req.secure) {
      res.cookie('views', '1', { expires: new Date(2030, 1, 1), secure: true});
    } else {
      res.cookie('views', '1', { expires: new Date(2030, 1, 1)});
    }
  }

  if (req.path == "/") {
    res.render('index', model);
  } else if (req.path == "/partner") {
    res.render('partner', model);
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

exports.console = function (req, res) {
  res.render('console');
};

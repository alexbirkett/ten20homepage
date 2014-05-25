
/*
 * GET home page.
 */
var home = require('../config/home');
var partner = require('../config/partner');

function extend(dst, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dst[key] = src[key];
    }
  }
}

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
    extend(model, home);
    res.render('index', model);
  } else if (req.path == "/partner") {
    extend(model, partner);
    res.render('index', model);
  } else {
    res.status(404);
    res.render('404', {
        head: { title: 'Page Not Found'}
      }
    );
  }
};

exports.console = function (req, res) {
  var model = {
    head: {
      title: "console | ten20live",
      metaKeywords: home.head.metaKeywords,
      metaDescription: home.head.metaDescription
    }
  };
  res.render('console', model);
};

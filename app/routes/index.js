
/*
 * GET home page.
 */
var home = require('../config/home');

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
  if (req.cookies.cookieWarningDisplayed) {
      model.hideCookieWarning = true;
  } else {
    // set cookie
    model.hideCookieWarning = false;
    // IE8 doesn't support max-age, so have to fallback to expires,
    // though a bit older
    var expires = new Date();
    expires.setDate(expires.getDate() + 2 * 365);
    if (req.secure) {
      res.cookie('cookieWarningDisplayed', '1', { expires: expires, secure: true});
    } else {
      res.cookie('cookieWarningDisplayed', '1', { expires: expires});
    }
  }

  if (req.path == "/") {
    extend(model, home);
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

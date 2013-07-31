var scrypt = require("scrypt");
var passport = require('passport');
var maxtime = 0.1;
var db;

module.exports = {
  setDb: function(dbs) {
    db = dbs;
  },

  signin: function(req, res, next) {
    var userInfo = req.body;

    if ( userInfo.remember ) {
      req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
    } else {
      req.session.cookie.expires = false;
    }

    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.json(info);
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.json({message: ''});
      });
    })(req, res, next);
  },

  signout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  signup: function(req, res) {
    var userInfo = req.body;


    db.user.findOne({email: userInfo.email}, function(error, user) {
      if (!error) {
        if (!user) {
          scrypt.passwordHash(userInfo.password, maxtime, function(err, pwdhash) {
            if (!err) {
              //pwdhash should now be stored in the database
              userInfo.hash = pwdhash;
              delete userInfo.password;
              delete userInfo.rememberMe;
              db.user.insert(userInfo, function(error, docs) {
                // body...
                req.login(userInfo, function(err) {
                  if (err) { return next(err); }
                  return res.json({message: ''});
                });
              });
            } else {
              res.json({message: 'server interal error!'});
            }
          });
        // already exist username
        } else {
          res.json({message: 'username already exists!'});
        }
      } else {
          res.json({message: 'server interal error!'});
      }
    });
  },

  dashboard: function(req, res) {
    res.render('user', req.user);
  }
};

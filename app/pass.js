var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    scrypt = require("scrypt"),
    userCollection;

// Remember Me implementation helper method
generateRandomToken = function () {
  var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//
passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = generateRandomToken();
      userCollection.findOne( { acessToken: token }, function (err, existingUser) {
      if (err) { return done(err); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
          userCollection.update({email: user.email}, {$set: {acessToken: token}}, function (err) {
          if (err) return done(err);
          return done(null, token);
        });
      }
    });
  };

  if ( user._id ) {
    createAccessToken();
  }
});

passport.deserializeUser(function(token, done) {
    userCollection.findOne( {acessToken: token }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(mail, password, done) {
      userCollection.findOne({ email: mail}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + mail}); }
      scrypt.verifyHash(user.hash, password, function(err, isMatch) {
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    next();
  } else {
    res.redirect('/#signin');
  }
};

exports.setDb = function(db) {
    userCollection = db.collection('user');
};


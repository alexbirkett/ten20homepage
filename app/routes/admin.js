var config = require('../config.js');
var ObjectID = require('mongodb').ObjectID;

var contactCollection;

exports.setDb = function(db) {
    contactCollection = db.collection('contact');
};

exports.authenticateMiddleware = function(req, res, next) {
    if (req.signedCookies.authorized || req.path === '/login') {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

exports.admin =  {

    get: function(req, res) {
        res.render('admin', { pageTitle: 'Admin | ten20live' });

    },
    login : {
        get: function (req, res) {
            res.render('login', {pageTitle: 'Login | ten20live'});
        },
        post: function(req, res) {
            var username = req.param('username');
            var password = req.param('password');

            if (username === config.username &&
                password === config.password) {
                res.cookie('authorized', '1', { maxAge: 14*24*60*60*1000, signed: true });
                res.json({message: ''});
            } else {
                res.json({message: 'login failed!'});
            }
        }
    },
    logout: {
        get: function (req, res) {
            res.clearCookie('authorized');
            res.redirect('/admin/login');
        }
    },
    data:{
        get: function(req, res) {
            contactCollection.find().toArray(function(error, users) {
                if (error) {
                    users = [];
                }
                res.json(users);
            });
        },
        ":id": {
            delete: function(req, res) {
                var id = req.param('id');
                console.log(id);
                contactCollection.findAndRemove({_id: new ObjectID(id)}, function(err, contact) {
                    if (err || !contact) {
                        res.json({error: 'query contact failed!'});
                    } else {
                        res.json({error: ''});
                    }
                });
            }
        }

    }
};
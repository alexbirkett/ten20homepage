var config = require('../config.js');
var ObjectID = require('mongodb').ObjectID;

var db = {};

exports.setDb = function(dbs) {
    db = dbs;
};

exports.admin =  {

    get: function(req, res) {

        if (req.signedCookies.authorized) {
            res.render('admin', { pageTitle: 'Admin | ten20live' });
        } else {
            res.redirect('/admin/login');
        }
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
    data:{
        get: function(req, res) {
            db.contact.find().toArray(function(error, users) {
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
                db.contact.findAndRemove({_id: new ObjectID(id)}, function(err, contact) {
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
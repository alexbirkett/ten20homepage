var path = require('path');
var Poet = require('poet');
var blogModel = require('../config/docs');

module.exports = function (app) {
  // init config
  var poet = Poet(app, {
    posts: path.normalize('./_posts/'),
    postsPerPage: 5,
    metaFormat: 'json'
  });

  poet.addRoute('/docs', function (req, res, next) {
    var posts = poet.helpers.getPosts();
    if (posts.length) {
      blogModel.posts = posts;
      res.render('posts/index', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/docs/:post', function (req, res, next) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
      blogModel.post = post;
      res.render('posts/post', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/docs/tag/:tag', function (req, res, next) {
    var posts = poet.helpers.postsWithTag(req.params.tag);
    if (posts) {
      blogModel.posts = posts;
      res.render('posts/tag', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/docs/page/:page', function (req, res) {
    var page = req.params.page,
        lastPost = page * 3;
    blogModel.posts = poet.helpers.getPosts(lastPost - 3, lastPost);
    blogModel.page = page;
    res.render('posts/page', blogModel);
  });
  
  poet.addRoute('/docs/category/:category', function (req, res, next) {
    var posts = poet.helpers.postsWithCategory(req.params.category);
    if (posts) {
      blogModel.posts = posts;
      res.render('posts/category', blogModel);
    } else {
      res.send(404);
    }
  }).init(function (err, poet) {
    console.log('poet init: ', err || 'successful'); 
  });

  return poet;
}


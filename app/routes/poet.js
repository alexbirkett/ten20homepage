var path = require('path');
var Poet = require('poet');
var blogModel = require('../config/blog');

module.exports = function (app) {
  // init config
  var poet = Poet(app, {
    posts: path.normalize('./_posts/'),
    postsPerPage: 5,
    metaFormat: 'json'
  });

  poet.addRoute('/blogs', function (req, res, next) {
    var posts = poet.helpers.getPosts();
    if (posts.length) {
      blogModel.posts = posts;
      res.render('posts/index', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/blogs/:post', function (req, res, next) {
    var post = poet.helpers.getPost(req.params.post);
    if (post) {
      blogModel.post = post;
      res.render('posts/post', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/blogs/tag/:tag', function (req, res, next) {
    var posts = poet.helpers.postsWithTag(req.params.tag);
    if (posts) {
      blogModel.posts = posts;
      res.render('posts/tag', blogModel);
    } else {
      res.send(404);
    }
  });

  poet.addRoute('/blogs/category/:category', function (req, res, next) {
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


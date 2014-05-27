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
    res.render('posts/index', blogModel);
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

  poet.addRoute('/blogs/page/:page', function (req, res) {
    var page = req.params.page,
        lastPost = page * 3;
    blogModel.posts = poet.helpers.getPosts(lastPost - 3, lastPost);
    blogModel.page = page;
    res.render('posts/page', blogModel);
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

  poet.watch();

  // rss route for poet
  app.get('/blog-rss', function (req, res) {
    // Only get the latest posts
    var posts = poet.helpers.getPosts(0, 7);
    res.setHeader('Content-Type', 'text/rss+xml');
    res.render('posts/rss', { posts: posts });
  });

  app.get('/blogs/search/:key', function (req, res) {
    var key = req.params.key;
    var posts = poet.helpers.getPosts();

    blogModel.posts = [];

    posts.forEach(function(post) {
      title = post.title.toLowerCase();
      if (title.indexOf(key.toLowerCase()) !== -1) {
        blogModel.posts.push(post);
      }
    });

    blogModel.key = key;
    res.render('posts/search', blogModel);
  });
}


var assert = require('assert');
var Browser = require('zombie');
var browser;

describe('admin page', function() {

  this.timeout(25000);

  before(function(done) {
    browser = new Browser({ debug: false,
      maxWait: 10, loadCSS: false, runScripts: true, waitFor: 10000});
    done();
  })

  it('should redirect to admin login correct', function(done) {
    browser.visit('http://localhost:3000/admin', function() {
      assert.ok(browser.success);
      assert.ok(browser.redirected);
      assert.equal(browser.url, 'http://localhost:3000/admin/login');
      done();
    });
  });

  it('should reject invalid user to login', function(done) {
      browser.fill('#username', 'John');
      browser.fill('#password', '1234');
      browser.pressButton('.btn').then(function() {
        assert.ok(browser.success);
        assert.equal(browser.text('h5.alerter'), 'login failed!');
      }).then(done, done);
  });

  it('should accept valid user to login', function(done) {
      browser.fill('#username', 'ten20live');
      browser.fill('#password', 'admin');
      browser.pressButton('.btn').then(function() {
        assert.ok(browser.success);
        assert.ok(browser.cookies().get('authorized'));
        console.log(browser.url)
      }).then(done, done);
  });

  it('should show admin page correct', function(done) {
    browser.visit('http://localhost:3000/admin', function() {
      assert.ok(browser.success);
      assert.equal(browser.url, 'http://localhost:3000/admin');
      assert.ok(browser.queryAll(".ngCellText"));
      done();
    });
  });
});

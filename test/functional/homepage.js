process.env.NODE_ENV = 'test';
// get the application server module
var assert = require('assert');
var Browser = require('zombie');
var browser;



describe('home page', function() {

  this.timeout(25000);

  before(function(done) {
    browser = new Browser({ site: 'http://localhost:3000',
      maxWait: 10, loadCSS: false, runScripts: true, waitFor: 10000});
    done();
  });

  it('should render home page correct', function(done) {
    browser.visit('/', function() {
    assert.ok(browser.success);
    assert.equal(browser.text("title"), 'ten20 - Track the location of people and things');
    assert.equal(browser.queryAll(".contact").length, 5);
    done();
    });
  });

  it('should run map and form script ok', function(done) {
    assert.equal(browser.evaluate("typeof window.ten20"), 'object');
    assert.equal(browser.evaluate("typeof window.ten20.MapRender"), 'function');
    assert.equal(browser.evaluate("typeof window.ten20.ContactForm"), 'function');
    done();
  });

  /*
     it('should refuse partial submissions', function(done) {
     var browser = this.browser;
     browser.fill('first_name', 'John');
     browser.pressButton('Send').then(function() {
     assert.ok(browser.success);
     assert.equal(browser.text('h1'), 'Contact');
     assert.equal(browser.text('div.alert'), 'Please fill in all the fields');
     }).then(done, done);
     });

     it('should keep values on partial submissions', function(done) {
     var browser = this.browser;
     browser.fill('first_name', 'John');
     browser.pressButton('Send').then(function() {
     assert.equal(browser.field('first_name').value, 'John');
     }).then(done, done);
     });

     it('should refuse invalid emails', function(done) {
     var browser = this.browser;
     browser.fill('first_name', 'John');
     browser.fill('last_name', 'Doe');
     browser.fill('email', 'incorrect email');
     browser.fill('message', 'Lorem ipsum');
     browser.pressButton('Send').then(function() {
     assert.ok(browser.success);
     assert.equal(browser.text('h1'), 'Contact');
     assert.equal(browser.text('div.alert'), 'Please check the email address format');
     }).then(done, done);
     });

     it('should accept complete submissions', function(done) {
     var browser = this.browser;
     browser.fill('first_name', 'John');
     browser.fill('last_name', 'Doe');
     browser.fill('email', 'test@example.com');
     browser.fill('message', 'Lorem ipsum');
     browser.pressButton('Send').then(function() {
     assert.ok(browser.success);
     assert.equal(browser.text('h1'), 'Message Sent');
     assert.equal(browser.text('p'), 'Thank you for your message. We\'ll answer you shortly.'');
     }).then(done, done);
     });
     */

  it('should render partner page correct', function() {
    browser.clickLink("Partner program", function() {
      assert.ok(browser.success);
      assert.equal(browser.text("title"), 'ten20 partner program');
      assert.equal(browser.queryAll(".contact").length, 5);
    });
  });

});

var assert = require('assert');
var Browser = require('zombie');
var browser;



describe('home page', function() {

  this.timeout(25000);

  before(function(done) {
    browser = new Browser({ debug: false,
      maxWait: 10, loadCSS: false, runScripts: true, waitFor: 10000});

    browser.visit('http://localhost:3000/');

    function mapLoaded() {
      return browser.document.querySelector(".leaflet-zoom-animated");
    }
    browser.wait(mapLoaded, done);

  })

  it('should render home page correct', function(done) {
    assert.ok(browser.success);
    assert.equal(browser.text("title"), 'ten20 - Track the location of people and things');
    assert.equal(browser.queryAll(".contact").length, 5);
    done();
  });

  it('should run map and form script ok', function(done) {
    assert.equal(browser.evaluate("typeof window.ten20"), 'object');
    assert.equal(browser.evaluate("typeof window.ten20.MapRender"), 'function');
    assert.equal(browser.evaluate("typeof window.ten20.ContactForm"), 'function');
    done();
  });

  it('should refuse partial submissions', function(done) {
    browser.clickLink("Contact Us", function() {
      browser.fill('#contact-us #first_name', 'John');
      browser.pressButton('#contact-us .submit').then(function() {
        assert.ok(browser.success);
        assert.equal(browser.text('#contact-us h3.require.active'), 'Please fill in the required fields!');
      }).then(done, done);
    });
  });

  it('should keep values on partial submissions', function(done) {
    browser.fill('#contact-us #first_name', 'John');
    browser.pressButton('#contact-us .submit').then(function() {
      assert.equal(browser.field('#contact-us #first_name').value, 'John');
    }).then(done, done);
  });

  it('should accept complete submissions', function(done) {
    browser.fill('#contact-us #first_name', 'John');
    browser.fill('#contact-us #last_name', 'Doe');
    browser.fill('#contact-us #email', 'test@example.com');
    browser.pressButton('#contact-us .submit').then(function() {
      assert.ok(browser.success);
      assert.equal(browser.text('#contact-us h3.success.active'), "We'll be in touch soon!");
    }).then(done, done);
  });

  it('should render partner page correct', function() {
    browser.clickLink("Partner program", function() {
      assert.ok(browser.success);
      assert.equal(browser.text("title"), 'ten20 partner program');
      assert.equal(browser.queryAll(".contact").length, 5);
    });
  });

});

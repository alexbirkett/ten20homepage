'user strict'

describe("admin page tests", function() {
  beforeEach(function() {
    browser().navigateTo('/admin');
  });

  it('should redirect to login page correnctly', function() {
    expect(browser().window().path()).toEqual('/admin/login');
    expect(element('title').text()).toEqual('Login | ten20live');
    expect(element('.login-form ').count()).toBe(1);
  });

  it('should login fail with wrong credentials', function() {
    // input credentials
    element('.login-form #username').val('test');
    element('.login-form #password').val('test');

    // submit
    element('.login-form .btn').query(function(elements, done) {
      elements.click();
      setTimeout(done, 1000);
    });

    expect(element('.login-form ').count()).toBe(1);
    expect(element('.login-form #username').val()).toBe('test');
    expect(element('.login-form #password').val()).toBe('test');
  });

  it('should login success with right credentials', function() {
    // input credentials
    element('.login-form #username').val('ten20live');
    element('.login-form #password').val('admin');

    // submit
    element('.login-form .btn').query(function(elements, done) {
      elements.click();
      setTimeout(done, 2000);
    });

    expect(browser().window().path()).toEqual('/admin');
    expect(element('.login-form').count()).toBe(0);
    expect(element('.ngTopPanel').count()).toBe(1);
    expect(element('.ngViewport').count()).toBe(1);
    expect(element('.ngFooterPanel').count()).toBe(1);

  });

  it('should delete item correctly', function() {
    var initNum = binding('totalServerItems');

    if (initNum > 0) {
      // delete an item
      element('.ngCell.col8 input[type="button"]').query(function(elements, done) {
        elements[0].click();
        setTimeout(done, 2000);
      });

      expect(binding('totalServerItems')).toBe(initNum-1);
    }

  });

  it('should logout success', function() {
    element('.header-bar .exit').query(function(elements, done) {
      elements.click();
      setTimeout(done, 2000);
    });

    expect(browser().window().path()).toEqual('/admin/login');
    expect(element('.login-form').count()).toBe(1);
  });
});

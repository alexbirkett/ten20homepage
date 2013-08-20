'user strict'

describe("partner page tests", function() {
  beforeEach(function() {
    browser().navigateTo('/partner');
  });

  it('page should render correnctly', function() {
    expect(element('title').text()).toEqual('ten20 partner program');
    expect(element('.contact').count()).toBe(5);
  });

  it('maps render properly', function() {
    expect(element('.leaflet-map-pane').count()).toBe(1);
  });

  it('local nav links work properly', function() {
    element('a[href="#about-us"]').click();
    expect(browser().window().hash()).toEqual('about-us');
  });

  it('foreign nav links work properly', function() {
    element('a[href="/#supported"]').click();
    expect(browser().window().path()).toEqual('/');
    expect(browser().window().hash()).toEqual('supported');
  });

  it('contact forms shows and hides properly', function() {
    expect(element('#contact-us').css('display')).toEqual('none');

    element('.nav a[href="#contact-us"]').click();
    expect(browser().window().hash()).toEqual('contact-us');
    expect(element('#contact-us').css('display')).toEqual('block');

    element('#contact-us .cancel').click();
    expect(browser().window().path()).toEqual('/partner');
  });

  it('contact forms should submit success', function() {
    element('.call-to-action a[href="#contact-us"]').click();

    // change input value
    element('#contact-us #first_name').val('testPARTNER-FIRSTNAME');
    element('#contact-us #last_name').val('testPARTNER-LASTNAME');
    element('#contact-us #email').val('testPARTNER-MAIL');

    // update data field
    element('#contact-us input').query(function(elements, done) {
      elements.focus();
      elements.blur();
      done();
    });

    // submit
    element('#contact-us .submit').query(function(elements, done) {
      elements.click();
      setTimeout(done, 1000);
    });

    expect(element('#contact-us form').css('display')).toEqual('none');
    expect(element('#contact-us .success.active').text()).toEqual("We'll be in touch soon!");
    expect(element('#contact-us .btn-ok').css('display')).toEqual('inline-block');
    element('#contact-us .btn-ok').click();

  });

  it('contact forms prevents submit when require field empty', function() {
    element('.call-to-action a[href="#contact-us"]').click();
    expect(browser().window().hash()).toEqual('contact-us');
    expect(element('#contact-us').css('display')).toEqual('block');

    element('#contact-us .submit').click();
    expect(element('#contact-us .require.active').text()).toEqual('Please fill in the required fields!');
    expect(element('#contact-us input.required').count()).toBe(3);

    element('#contact-us .cancel').click();
  });

});

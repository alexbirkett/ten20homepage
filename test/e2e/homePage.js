'user strict'

describe("home page tests", function() {
  beforeEach(function() {
    browser().navigateTo('/index');
  });

  it('page should render correnctly', function() {
    expect(element('title').text()).toEqual('ten20 - Track the location of people and things');
    expect(element('.contact').count()).toBe(5);
  });
});

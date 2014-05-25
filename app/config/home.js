module.exports = {
  head: require('./sections/head'),
  benefits: require('./sections/benefits'),
  features: require('./sections/features'),
  slides: require('./sections/supported-hardware'),
  about: require('./sections/about'),
  faq: require('./sections/faq'),
  controller: 'HomeCtrl',
  master: {
    "title": "Track the location of people and things", 
    "subTitle": "Supports GPS trackers and mobile apps",
    "buttonText": "Sign up now"
  },
  navs: [
      {
        "text": "Supported hardware",
        "link": "#supported",
        "scroll": "true"
      },
      {
        "link": "/console",
        "text": "sign in"
      },
      {
        "link": "/blogs",
        "text": "blogs"
      },
      {
          "text": "Subreddit forum",
          "link": "http://www.reddit.com/r/ten20/",
          "scroll": "false"
      },
      {
        "text": "About Us",
        "link": "#about-us",
        "scroll": "true"
      }
    ]
};

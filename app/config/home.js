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
  navs: require('./sections/nav')
};

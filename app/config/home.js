module.exports = {
  head: require('./sections/head'),
  master: {
    "title": "Track the location of people and things", 
    "subTitle": "Supports GPS trackers and mobile apps",
    "buttonText": "get started now"
  },
  benefits: require('./sections/benefits'),
  features: require('./sections/features'),
  slides: require('./sections/supported-hardware'),
  plans: require('./sections/plans'),
  about: require('./sections/about'),
  faq: require('./sections/faq'),
  controller: 'HomeCtrl'
};

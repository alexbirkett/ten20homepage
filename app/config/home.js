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
    "buttonText": "get started now"
  },
  navs: [
      {
        "text": "Supported hardware",
        "link": "/#supported",
        "scroll": "true"
      },
      {
        "text": "Plans",
        "link": "/#plans",
        "scroll": "true"
      },
      {
        "text": "Partner program",
        "link": "/partner",
        "scroll": "false"
      },
      {
        "modal": true,
        "id": "contact",
        "text": "Contact Us"
      },
      {
        "link": "/console",
        "text": "sign in"
      },
      {
        "text": "About Us",
        "link": "#about-us",
        "scroll": "true"
      }
      /*
      {
        "text": "FAQ",
        "link": "/#faq",
        "scroll": "true"
      }
      */
    ]
};

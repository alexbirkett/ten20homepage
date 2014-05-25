module.exports = {
  head: require('./sections/head'),
  benefits: require('./sections/benefits'),
  master: {
    "title": "Get 30% commission for referring customers", 
    "subTitle":"You get paid when we get paid",
    "buttonText": "ENROLL NOW"
  },
  about: require('./sections/about'),
  controller: 'PartnerCtrl',
  navs: [
    {
      "text": "Supported hardware",
      "link": "/#supported",
      "scroll": "true"
    },
    {
      "text": "Plans",
      "link": "/#plans",
      "scroll": "true",
      "hidden": "true"
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
      "link": "/blogs",
      "text": "blogs"
    },
    {
      "text": "About Us",
      "link": "#about-us",
      "scroll": "true"
    }
  ]
};

var mongoose = require('mongoose');
mongoose.set('debug', true);


module.exports = function(url) {
  var model = {};

  var db = mongoose.connect(url || 'mongodb://localhost/contact_info');
  console.log('mongodb connected...');
  mongoose.connection.on('error', function() {
    console.log('connection error...');
  });

  // setup model
  model.contact = mongoose.model('Contact',{
    first_name: {type: String, index: true},
    last_name: {type: String, index: true},
    email: {type: String, index: true},
    phone: String,
    company_name: String,
    website: String,
    call_me: Boolean,
    news_letter: Boolean,
    submitted_form: String // the form from which user submit: 
                           // 'contact-us', 'free-plan', 'family-plan', 'enterprise-plan'
  });

  return model;
}

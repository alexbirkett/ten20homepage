$(function(){

  // scroll effects
  $('.nav li a').each(function() {
    var id;
    var scroll = $(this).attr('scroll');

    if (scroll === 'true' && location.pathname === '/') {
      id = $(this).attr('href').replace('/', '');
      if ($(id).length != 0) {

        $(this).on('click', function (e) {
          var offset = $(id).offset().top;
          $('body').animate({scrollTop: offset}, 800);
        });
      }
    }
  });


  window.ten20.submitForm = function (postUrl, redirectUrl) {

    var self = $('.submit-form');

    self.find('.btn').on('click', function(e) {
      e.preventDefault();

      var data = {};

      self.find('input').each(function () {
        var name = $(this).attr('id');
        data[name] = $(this).val();
      });

      if (data['re-password'] &&
        data['re-password'] != data['password']) {
          self.find('input[id="password"]').val('');
          self.find('input[id="re-password"]').val('');
          doAlert('password not match!');
          return;
        }

      $.post(postUrl || '/', data, function(res) {
        window.location = redirectUrl || '/';
      }).fail(function(res) {
        var responseJSON = res.responseJSON;
        if (responseJSON && responseJSON.message && responseJSON.message !== '') {
          doAlert(res.message);
        }
      });

      function doAlert(msg) {
        var alerter = self.find('.alerter');
        alerter.text(msg);
        alerter.show();

        setTimeout(function () {
          alerter.fadeOut(2000);
        }, 1000);
      }
    });
  }

});

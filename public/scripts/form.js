$(function(){

  // scroll effects
  $('.nav li a').each(function() {
    var id;
    var scroll = $(this).attr('scroll');

    if (scroll === 'true' && location.pathname === '/') {
      id = $(this).attr('href').replace('/', '');
      if ($(id).length != 0) {
        var offset = $(id).offset().top;

        $(this).on('click', function (e) {
          $('body').animate({scrollTop: offset}, 800);
        });
      }
    }
  });

});

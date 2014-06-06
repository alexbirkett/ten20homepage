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

  var id = location.hash;
  if ($(id).length) {
    var offset = $(id).offset().top;
    setTimeout(function() {
      $('a[href="/' + id + '"]').click();
    }, 0);
  }

  // init carousel
  $('.jcarousel')
    .on('jcarousel:create jcarousel:reload', function() {
      var element = $(this),
          width = element.innerWidth();

      // This shows 1 item at a time.
      // Divide `width` to the number of items you want to display,
      // eg. `width = width / 3` to display 3 items at a time.
      element.jcarousel('items').css('width', width + 'px');
    }).jcarousel({
      center: true,
      wrap: 'circular',
      transitions: true,
      animation: {
        duration: 400,
        easing:   'linear',
        complete: function() {
        }
      },
    }).jcarouselAutoscroll({
      interval: 5000,
      target: '+=1',
      autostart: true
    });

  $('.jcarousel-prev').jcarouselControl({
    target: '-=1'
  });

  $('.jcarousel-next').jcarouselControl({
    target: '+=1'
  });

  
  $('.jcarousel-pagination').jcarouselPagination({
    item: function(page) {
      return '<a href="#' + page + '"></a>';
    }
  });

  $('.jcarousel-pagination').on('jcarouselpagination:active', 'a', function() {
    $(this).addClass('active');
  });

  $('.jcarousel-pagination').on('jcarouselpagination:inactive', 'a', function() {
    $(this).removeClass('active');
  });

});

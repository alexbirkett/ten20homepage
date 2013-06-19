
$(function(){
    $('.carousel').carousel();

    // show contact form when url == '/#contact'
    if (location.hash == "#contact") {
      $('.contact').fadeIn(reSizeInput);
    }

    // fake checkbox
    $('.form input[type="checkbox"]').addClass('regular-checkbox').after('<label class="fakeCheckBox"></label>');

    var tabindex = 1;
    $('.form input[type="text"], .form input + label').each(function() {
        var $input = $(this);
        $input.attr("tabindex", tabindex);
        tabindex++;
    });

    $('.fakeCheckBox').on('click', function() {
      if ($(this).prev('input').prop("checked")) {
        $(this).prev('input').prop('checked', false);
      } else {
        $(this).prev('input').prop('checked', true);
      }
    });

    // bind contact us nav
    $('a[href="#contact"]').on('click', function(e) {
      $('.contact').fadeIn(reSizeInput);
    });

    $('.form .cancel').on('click', function(e) {
      restorePage();
    });

    $('.form button').on('click', function(e) {
      e.preventDefault();
      restorePage();
    });

    function restorePage() {
      $('.contact').fadeOut();
      location.hash = "";
      $("body").css('overflow', 'scroll');
    }

    // dynamically set input width
    function reSizeInput() {
      var contactItems = $('.contact .form .list-text');
      var totalWidth = $('.contact .form ul').innerWidth();

      $("body").css('overflow', 'hidden');

      contactItems.each(function(index){
        var elemLabel = $(this).children('label');
        var labelWidth = elemLabel.outerWidth(true);
        var marginRight = parseInt(elemLabel.css('marginRight'));
        $(this).children('input[type="text"]').width(totalWidth - labelWidth - marginRight);
      });
    }

});

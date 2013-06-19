
$(function(){
    $('.carousel').carousel();

    // dynamically set input width
    var contactItems = $('.form li');
    var totalWidth = $('.form ul').innerWidth();

    contactItems.each(function(index){
      var elemLabel = $(this).children('label');
      var labelWidth = elemLabel.outerWidth(true);
      var marginRight = parseInt(elemLabel.css('marginRight'));
      $(this).children('input[type="text"]').width(totalWidth - labelWidth - marginRight);
    });


    // fake checkbox
    $('.form input[type="checkbox"]').addClass('regular-checkbox').after('<label class="fakeCheckBox"></label>');

    $('.fakeCheckBox').on('click', function() {
      if ($(this).prev('input').prop("checked")) {
        $(this).prev('input').prop('checked', false);
      } else {
        $(this).prev('input').prop('checked', true);
      }
    });

    // bind contact us nav
    $('a[href="/#contact"]').on('click', function(e) {
      e.preventDefault();
      $('.contact').show();
    });

    $('.form button').on('click', function(e) {
      e.preventDefault();
      $('.contact').hide();
    });
});

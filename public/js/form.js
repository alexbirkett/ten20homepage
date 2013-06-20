window.ten20 = window.ten20 || {};

//TODO: to debug later
window.ten20.carouselMaps = (function() {
  var mapsArray = [];
  var renderComplete = 0;

  return function(map) {
    var $map = $(map.getContainer());
    mapsArray.push($map);

    map.whenReady(function() {
      var parentCarousel = $map.parent('.carousel');
      $map.parent('.item').removeClass('show');
      renderComplete++;
      if (mapsArray.length == 3) {
        parentCarousel.css("visibility", "visible");
        parentCarousel.carousel(7000);
      }
    }); 
  }

})();

window.ten20.ContactForm = (function() {

  function ContactForm (id) {
    this.id = id;
    this.init();
  }

  ContactForm.prototype.init = function () {
    this.$self = $('#' + this.id); 
    this.fakeCheckBox();
    this.bindEvent();
  };

  ContactForm.prototype.bindEvent = function () {
    // show form when url == '/:id'
    var self = this;
    if (location.hash == "#contact-us") {
      this.$self.fadeIn();
      this.resizeInput();
    }

    // bind nav links
    $('a[href="#' + this.id + '"]').on('click', function(e) {
      self.$self.fadeIn();
      self.resizeInput();
    });

    this.$self.find('.cancel').on('click', function() {
      self.restorePage();
    });

    this.$self.find('button').on('click', function(e) {
      e.preventDefault();
      //TODO: check required input 
      //TODO: send post to server
      self.restorePage();
    });
  }

  ContactForm.prototype.restorePage = function () {
      this.$self.fadeOut();
      window.location.hash = "";
      $("body").css('overflow', 'scroll');
  };

  ContactForm.prototype.fakeCheckBox = function () {

      if (this.$self.find('input[type="checkbox"]').length != 0) {

        this.$self.find('input[type="checkbox"]').addClass('regular-checkbox').after('<label class="fakeCheckBox"></label>');

        this.$self.find('.fakeCheckBox').on('click', function() {

          if ($(this).prev('input').prop("checked")) {
            $(this).prev('input').prop('checked', false);
          } else {
            $(this).prev('input').prop('checked', true);
          }
        });
      }
  };

  // dynamically set input width of contact forms
  ContactForm.prototype.resizeInput = function () {
      var inputItems = this.$self.find('.list-text');
      var totalWidth = this.$self.find('.form ul').innerWidth();

      $("body").css('overflow', 'hidden');

      inputItems.each(function(index){
        var elemLabel = $(this).children('label');
        var labelWidth = elemLabel.outerWidth(true);
        var marginRight = parseInt(elemLabel.css('marginRight'));
        $(this).children('input[type="text"]').width(totalWidth - labelWidth - marginRight);
      });

      this.$self.find('li:first-child input').focus();
  };

  return ContactForm;

})();



// carousel start function
$(function(){

    startCarousel();

    // only start non-map carousel
    function startCarousel() {
      $('.carousel').each(function() {
        if ($(this).children('.carousel-map')) {
          return;
        } else {
          $(this).carousel();
        }
      });
    }

});

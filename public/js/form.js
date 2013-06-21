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
    this.form_data = {};
    this.$self = $('#' + this.id); 
    this.fakeCheckBox();
    this.bindEvent();
    this.bindInput();
  };

  ContactForm.prototype.bindEvent = function () {
    // show form when url == '/:id'
    var self = this;
    if (location.hash == "#contact-us") {
      this.$self.fadeIn();
      this.resizeInput();
    }

    // bind nav links
    $('a[href="#' + this.id + '"]').on('click', function() {
      self.$self.fadeIn();
      self.resizeInput();
    });

    this.$self.find('.cancel').on('click', function() {
      self.restorePage();
    });

    this.$self.find('button').on('click', function(e) {
      e.preventDefault();
      if (self.checkFields()) {
        self.send();
        self.restorePage();
      } 
    });
  }

  // send post to server
  ContactForm.prototype.send = function () {
    var data = {};

    data.submitted_form = this.$self.attr('id');
    data.first_name = this.form_data['first-name'];
    data.last_name = this.form_data['last-name'];
    data.mail = this.form_data['email'] || '';
    data.phone = this.form_data['phone'] || '';
    data.company_name = this.form_data['company-name'] || '';
    data.website = this.form_data['company-website-url'] || '';
    data.call_me = this.form_data['call-me'] || false;
    data.news_letter = this.form_data['news-letter'] || false;
    
    $.ajaxSetup({timeout: 2000});

    console.log(data);

    $.post('/contact', {data: data}, 'json').
      done(function(res) {
        if (!res.error) {
          alert('send successful!');
        } else {
          alert('server process error!');
        }
      }).
      fail(function(jhr, text, thrown) {
        // body...
        alert(text);
      });
  }

  // dynamically save input fields to form object
  ContactForm.prototype.bindInput = function() {
    var self = this;

    // checkbox already bind state in fakeCheckbox
    this.$self.find('input[type="text"]').each(function () {
      $(this).blur(function() {
        self.form_data[$(this).attr('id')] = $(this).val();
      })
    });

  }

  ContactForm.prototype.checkFields = function() {

    return true;
  }

  ContactForm.prototype.restorePage = function () {
      this.$self.fadeOut();
      window.location.hash = "";
      $("body").css('overflow', 'scroll');
  };

  // need fakecheckbox to show distinguished design
  ContactForm.prototype.fakeCheckBox = function () {

    var self = this;

    this.$self.find('input[type="checkbox"]').each(function() {
      $(this).addClass('regular-checkbox').after('<label class="fakeCheckBox"></label>');
      self.form_data[$(this).attr('id')] = false;
    })

    // dynamic bind check behavior to real checkbox
    this.$self.find('.fakeCheckBox').on('click', function() {
      var checkbox = $(this).prev('input');

      if (checkbox.prop("checked")) {
        checkbox.prop('checked', false);
      } else {
        checkbox.prop('checked', true);
      }

      // save checkbox state to form object
      self.form_data[checkbox.attr('id')] = checkbox.prop('checked');
    });
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

window.ten20 = window.ten20 || {};

window.ten20.ContactForm = (function() {

  function ContactForm (option) {
    /*
     * id, ajaxUrl, redirectUrl
     */

    for (var key in option) {
      this[key] = option[key];
    };
    this.init();
  }

  ContactForm.prototype.init = function () {
    this.formData = {};
    this.$self = $('#' + this.id); 
    this.fakeCheckBox();
    this.bindEvent();
    this.bindInput();
  };

  ContactForm.prototype.bindEvent = function () {
    var self = this;
    if (location.hash === '#' + this.id) {
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
      } 
    });
  }

  // send post to server
  ContactForm.prototype.send = function () {
    var data = {};

    var self = this;

    data.formType = self.$self.attr('id');

    for (key in this.formData) {
      if (typeof this.formData[key].value === 'boolean') {
        data[key] = this.formData[key].value;
      } else {
        data[key] = this.formData[key].value || '';
      }
    }

    $.ajaxSetup({timeout: 2000});

    $.post(this.ajaxUrl,  data, 'json').
      done(function(res) {
        if (res.message != '') {
          self.$self.find('.success').text(res.message);
        } else {
          if (self.redirectUrl !== '') {
            window.location = self.redirectUrl;
          }
        }

        self.$self.find('.active').removeClass('active');
        self.$self.find('.success').addClass('active');

      }).
      fail(function(jhr, text, thrown) {
        self.$self.find('.active').removeClass('active');
        self.$self.find('.error').addClass('active');
      });
  }

  // dynamically save input fields to form object
  ContactForm.prototype.bindInput = function() {
    var self = this;

    // checkbox already bind state in fakeCheckbox
    this.$self.find('input[type="text"]').add('input[type="password"]').each(function () {
      self.formData[$(this).attr('id')] = {
        optional: $(this).attr('optional'),
        value: ''
      };

      $(this).on('keyup blur',function() {
        self.formData[$(this).attr('id')].value = $(this).val();

        if ($(this).val()) {
          $(this).removeClass('required');
        } 

        if (self.$self.find('.required').length === 0) {
          self.$self.find('.active').removeClass('active');
          self.$self.find('.description').addClass('active');
        } 
       
      });

    });

  }

  ContactForm.prototype.checkFields = function() {
    var check = true;

    for (key in this.formData) {
      if (this.formData[key].optional === 'false' && this.formData[key].value === '') {
        this.$self.find('#' + key).addClass('required');
        check = false;
      }
    }

    if (!check) {
      this.$self.find('.active').removeClass('active');
      this.$self.find('.require').addClass('active');
    }

    return check;
  }

  ContactForm.prototype.restorePage = function () {
      this.$self.fadeOut();
      window.history.back();
      $("body").css('overflow', 'scroll');
  };

  // need fakecheckbox to show distinguished design
  ContactForm.prototype.fakeCheckBox = function () {

    var self = this;

    this.$self.find('input[type="checkbox"]').each(function() {
      $(this).addClass('regular-checkbox').after('<label class="fakeCheckBox"></label>');
      self.formData[$(this).attr('id')] = {optional: 'true', value: false};
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
      self.formData[checkbox.attr('id')].value = checkbox.prop('checked');
    });
  };

  // dynamically set input width of contact forms
  ContactForm.prototype.resizeInput = function () {
      var inputItems = this.$self.find('list-text').add('list-password');
      var totalWidth = this.$self.find('.form ul').innerWidth();

      $("body").css('overflow', 'hidden');

      inputItems.each(function(index){
        var elemLabel = $(this).children('label');
        var labelWidth = elemLabel.outerWidth(true);
        var marginRight = parseInt(elemLabel.css('marginRight'));
        $(this).children('input').width(totalWidth - labelWidth - marginRight);
      });

  };

  return ContactForm;

})();


window.ten20.login = function () {
  $('form .btn').on('click', function(e) {
    e.preventDefault();
    var name = $('form #username').val();
    var password = $('form #password').val();
    $.post('/admin/login', {username: name, password: password}, function(res) {
      if (!res.status) {
        $('form .alerter').show();
        $('form #username').val('');
        $('form #password').val('');

        setTimeout(function () {
          $('form .alerter').fadeOut(2000);
        }, 1000);
      } else {
        window.location = '/admin';
      }
    });
  });
}

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

    // scroll effects
    $('.nav li a').each(function() {
      var id = $(this).attr('href');
      var scroll = $(this).attr('scroll');

      if (scroll === 'true') {
        var offset = $(id).offset().top;

        $(this).on('click', function (e) {
          $('body').animate({scrollTop: offset}, 800);
        });
      }
    });

});

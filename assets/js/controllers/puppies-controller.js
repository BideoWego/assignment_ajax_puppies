"use strict";

var PuppiesController = (function($) {

  var PuppiesController = function(options) {
    // points to the top level
    // container element
    // for rendering
    this.$element = $(options['element']);
  };

  // Hold on to elapsed time
  // to display progress message
  PuppiesController.prototype.delta = Date.now();

  // Render a flash message
  PuppiesController.prototype.flash = function(type, message) {
    this.render('shared/_flash', {
      type: type,
      message: message
    }, $('#flash'));
  };

  // Renders the create puppy form
  // Set appropriate AJAX callbacks
  PuppiesController.prototype.make = function() {
    var callbacks = {
      beforeSend: function(xhr) {
        $('#flash').show();
        this.flash('warning', 'Loading breeds...');
        this.delta = Date.now();
      },
      progress: function(e) {
        if (Date.now() - this.delta > 1000) {
          this.flash('warning', 'Sorry this is taking so long');
        }
      },
      success: function() {
        this.flash('success', 'Breeds loaded! Make a puppy!');
      },
      error: function(xhr, status, error) {
        this.flash('error', error);
      },
      complete: function() {
        $('#flash').delay(2000).fadeOut(1000);
        var breeds = Breed.all();
        this.render('puppies/_form', {
          breeds: breeds
        }, $('#content'), 'prepend', this.bindCreateForm);
      }
    };

    Breed.refresh(this, callbacks);
  };

  // Renders the puppies list
  // Sets appropriate AJAX callbacks
  // Calls make() to render create form
  PuppiesController.prototype.index = function() {
    var callbacks = {
      beforeSend: function(xhr) {
        $('#flash').show();
        this.flash('warning', 'Loading puppies...');
        this.render('shared/loading');
        this.delta = Date.now();
      },
      progress: function(e) {
        if (Date.now() - this.delta > 1000) {
          this.flash('warning', 'Sorry this is taking so long');
        }
      },
      success: function() {
        this.flash('success', 'Puppies loaded!');
      },
      error: function(xhr, status, error) {
        this.flash('danger', error);
      },
      complete: function() {
        $('#flash').delay(2000).fadeOut(1000);
        var puppies = Puppy.all();
        this.render('puppies/index', {
          puppies: puppies
        }, this.$element, 'html', this.bindDeleteLinks);
      }
    };

    Puppy.refresh(this, callbacks);
    this.make();
  };

  // Callback to the create form submit
  // Submits data to Puppy API
  // Sets AJAX callbacks
  PuppiesController.prototype.create = function(e) {
    e.preventDefault();

    var data = $(e.target).serializeArray();

    var callbacks = {
      beforeSend: function(xhr) {
        $('#flash').show();
        this.flash('warning', 'Creating puppy...');
        this.delta = Date.now();
      },
      progress: function(e) {
        if (Date.now() - this.delta > 1000) {
          this.flash('warning', 'Sorry this is taking so long');
        }
      },
      success: function(data) {
        var puppy = Puppy.find(data.id);
        this.flash('success', 'Puppy created!');
        this.render('puppies/_puppy', {
          puppy: puppy
        }, $('#puppies'), 'prepend', this.bindDeleteLinks);
      },
      error: function(xhr, status, error) {
        this.flash('danger', error);
      },
      complete: function() {
        $('#flash').delay(2000).fadeOut(1000);
      }
    };

    Puppy.create(data, this, callbacks);

    return false;
  };

  // Callback to adopt link click
  // Submits delete to API
  // Sets AJAX callbacks
  PuppiesController.prototype.destroy = function(e) {
    e.preventDefault();

    var id = $(e.target).attr('data-id');
    id = parseInt(id);

    var callbacks = {
      beforeSend: function() {
        $('#flash').show();
        this.flash('warning', 'Adopting puppy...');
        this.delta = Date.now();
      },
      progress: function(e) {
        if (Date.now() - this.delta > 1000) {
          this.flash('warning', 'Sorry this is taking so long');
        }
      },
      success: function(data) {
        this.flash('success', 'Puppy adopted!');
        $('#puppy-' + data.id).remove();
      },
      error: function(xhr, status, error) {
        this.flash('danger', error);
      },
      complete: function() {
        $('#flash').delay(2000).fadeOut(1000);
      }
    };

    Puppy.destroy(id, this, callbacks);

    return false;
  };

  // Binds the destroy() method to link clicks
  PuppiesController.prototype.bindDeleteLinks = function() {
    $('.puppy-delete-link').on('click', $.proxy(puppiesController.destroy, puppiesController));
  };

  // Binds the create() method to form submit
  PuppiesController.prototype.bindCreateForm = function() {
    $('#create-puppy').on('submit', $.proxy(puppiesController.create, puppiesController));
  };

  // Renders a given template
  // Passes that template the given data
  // Allows the target element to be set
  // Allows the func used to render to that element
  // to be set
  // Provides a callback for when rendering is finished
  PuppiesController.prototype.render = function(view, data, $element, func, callback) {
    var $element = ($element) ? $element : this.$element;
    var func = (func) ? func : 'html';
    var url = '/assets/js/views/' + view + '.handlebars';
    var that = this;
    $.ajax({
      url: url,
      success: function(response, status, xhr) {
        var template = Handlebars.compile(response);
        var rendered = template(data);
        $element[func](rendered);

        if (callback) {
          callback();
        }
      },
      context: that
    });
  };

  return PuppiesController;

})($);


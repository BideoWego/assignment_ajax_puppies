"use strict";

var PuppiesController = (function($) {

  var PuppiesController = function(options) {
    this.$element = $(options['element']);
  };

  PuppiesController.prototype.index = function() {
    var puppies = Puppy.all();
    var breeds = Breed.all();
    if (puppies.length === 0) {
      Puppy.refresh($.proxy(this.index, this));
    } else if (breeds.length === 0) {
      Breed.refresh($.proxy(this.index, this));
    } else {
      this.render('index', {
        puppies: puppies,
        breeds: breeds
      });
    }
  };

  PuppiesController.prototype.create = function(e) {
    e.preventDefault();

    var serialized = $(e.target).serializeArray();

    var that = this;
    Puppy.create(serialized, function(data) {
      var breed = Breed.find(data['breed_id']);
      var puppy = data;
      puppy.breed = breed;
      Puppy.insert(puppy);
      that.render('_puppy', puppy, $('#puppies'), 'append');
    });

    return false;
  };

  PuppiesController.prototype.destroy = function(id) {
    Puppy.destroy(id);
  };

  PuppiesController.prototype.render = function(view, data, $element, func) {
    var $element = ($element) ? $element : this.$element;
    var func = (func) ? func : 'html';
    var url = '/assets/js/views/puppies/' + view + '.handlebars';
    var that = this;
    $.ajax({
      url: url,
      success: function(response, status, xhr) {
        var template = Handlebars.compile(response);
        var rendered = template(data);
        $element[func](rendered);
      },
      context: that
    });
  };

  return PuppiesController;

})($);


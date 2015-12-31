"use strict";

var PuppiesController = (function($) {

  var PuppiesController = function(options) {
    this.$element = $(options['element']);
  };

  PuppiesController.prototype.index = function() {
    var puppies = Puppy.all();
    var breeds = Breed.all();
    var data = {
      puppies: puppies,
      breeds: breeds
    };
    var view = 'puppies/index';
    if (puppies.length === 0) {
      view = 'shared/loading';
      Puppy.refresh($.proxy(this.index, this));
    } else if (breeds.length === 0) {
      view = 'shared/loading';
      Breed.refresh($.proxy(this.index, this));
    }
    this.render(view, data);
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
      that.render('puppies/_puppy', puppy, $('#puppies'), 'append');
    });

    return false;
  };

  PuppiesController.prototype.destroy = function(e) {
    e.preventDefault();

    var id = $(e.target).attr('data-id');
    id = parseInt(id);

    Puppy.destroy(id, function() {
      $('#puppy-' + id).remove();
    });

    return false;
  };

  PuppiesController.prototype.render = function(view, data, $element, func) {
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
      },
      context: that
    });
  };

  return PuppiesController;

})($);


"use strict";

var Breed = (function($) {

  // The target URL for CRUD
  var END_POINT = 'https://ajax-puppies.herokuapp.com/breeds.json';

  // Array to cache results
  var _table = [];

  // Send an AJAX request with
  // listener as context for callbacks
  // and add a progress event
  var _sendAJAX = function(listener, options, onSuccess) {
    var progress = options['progress'];
    options['xhr'] = function() {
      var xhr = $.ajaxSettings.xhr();
      xhr.addEventListener('progress', function(e) {
        if (progress) {
          progress.call(listener, e);
        }
      });
      return xhr;
    };

    var success = options['success'];
    options['success'] = function(data, status, xhr) {
      onSuccess(data, status, xhr);

      if (success) {
        success.call(listener, data, status, xhr);
      }
    };

    $.ajax(options);
  };

  var Breed = function Breed() {};
  
  // Get all records
  Breed.all = function() {
    return _table;
  };

  // Refresh the cache from the API
  // Set the listener and callbacks
  // for the AJAX request
  Breed.refresh = function(listener, callbacks) {
    var options = {
      url: END_POINT,
      context: listener
    };

    options = $.extend(options, callbacks);

    _sendAJAX(listener, options, function(data) {
      _table = data;
    });
  };

  // Find a record in the cache
  // by its ID
  Breed.find = function(id) {
    for (var i = 0; i < _table.length; i++) {
      var breed = _table[i];
      if (breed.id === id) {
        return breed;
      }
    }
  };

  return Breed;

})($);


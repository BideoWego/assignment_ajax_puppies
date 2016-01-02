"use strict";

var Puppy = (function($) {

  // The target URL for CRUD
  var END_POINT = 'https://ajax-puppies.herokuapp.com/puppies.json';

  // Array to cache results
  var _table = [];

  var Puppy = function Puppy() {};

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

  // Get all records
  Puppy.all = function() {
    return _table;
  };

  // Refresh the cache from the API
  // Set the listener and callbacks
  // for the AJAX request
  Puppy.refresh = function(listener, callbacks) {
    var options = {
      url: END_POINT,
      context: listener
    };

    options = $.extend(options, callbacks);

    _sendAJAX(listener, options, function(data) {
      _table = data;
    });
  };

  // Create a record through API
  // pass it the given data
  // set the callback listener
  // and callbacks
  Puppy.create = function(data, listener, callbacks) {
    var options = {
      url: END_POINT,
      context: listener,
      method: 'POST',
      data: data
    };

    options = $.extend(options, callbacks);

    _sendAJAX(listener, options, function(data) {
      var breed = Breed.find(data['breed_id']);
      var puppy = data;
      puppy.breed = breed;
      Puppy.insert(puppy);
    });
  };

  // Destroy a record through API
  // given the ID
  // set the callback listener
  // and callbacks
  Puppy.destroy = function(id, listener, callbacks) {
    var options = {
      url: END_POINT.replace('.json', '/' + id + '.json'),
      context: listener,
      method: 'DELETE'
    };

    options = $.extend(options, callbacks);

    _sendAJAX(listener, options, function(data) {
      Puppy.remove(data.id);
    });
  };

  // Find a record in the cache
  // by its ID
  Puppy.find = function(id) {
    for (var i = 0; i < _table.length; i++) {
      var puppy = _table[i];
      if (puppy.id === id) {
        return puppy;
      }
    }
  };

  // Insert a record into the cache
  Puppy.insert = function(puppy) {
    _table.push(puppy);
  };

  // Remove a record from the cache
  Puppy.remove = function(id) {
    var record;
    for (var i = 0; i < _table.length; i++) {
      record = _table[i];
      if (record.id === id) {
        _table.splice(i, 1);
      }
    }
    return record;
  };

  return Puppy;

})($);


"use strict";

var PuppyAPI = (function($) {

  var END_POINT = 'https://ajax-puppies.herokuapp.com/puppies.json';

  var PuppyAPI = function PuppyAPI() {};

  PuppyAPI.error = null;

  PuppyAPI.list = function(callback) {
    PuppyAPI.error = null;
    $.ajax({
      url: END_POINT,
      success: callback,
      context: this,
      error: function(xhr, status, error) {
        PuppyAPI.error = error;
        console.error(error);
      }
    });
  };

  PuppyAPI.add = function(data, callback) {
    $.ajax({
      url: END_POINT,
      data: data,
      method: 'POST',
      success: callback,
      context: this,
      error: function(xhr, status, error) {
        PuppyAPI.error = error;
        console.error(error);
      }
    });
  };

  PuppyAPI.remove = function(id, callback) {
    var url = END_POINT.replace('.json', '/' + id + '.json')
    $.ajax({
      url: url,
      method: 'DELETE',
      success: callback,
      context: this,
      error: function(xhr, status, error) {
        PuppyAPI.error = error;
        console.error(error);
      }
    });
  };

  return PuppyAPI;

})($);


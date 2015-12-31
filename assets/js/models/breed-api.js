"use strict";

var BreedAPI = (function($) {

  var END_POINT = 'https://ajax-puppies.herokuapp.com/breeds.json';

  var BreedAPI = function BreedAPI() {};

  BreedAPI.list = function(callback) {
    $.ajax({
      url: END_POINT,
      success: callback,
      context: this,
      error: function(xhr, status, error) {
        console.error(error);
      }
    });
  };

  return BreedAPI;

})($);


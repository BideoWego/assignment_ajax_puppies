"use strict";

var BreedAPI = (function($) {

  var END_POINT = 'https://ajax-puppies.herokuapp.com/breeds.json';

  var BreedAPI = function BreedAPI() {};

  BreedAPI.error = null;

  BreedAPI.list = function(callback) {
    BreedAPI.error = null;
    $.ajax({
      url: END_POINT,
      success: callback,
      context: this,
      error: function(xhr, status, error) {
        BreedAPI.error = error;
        console.error(error);
      }
    });
  };

  return BreedAPI;

})($);


"use strict";

var Breed = (function(BreedAPI, $) {

  var _table = [];
  var _callback = null;

  var Breed = function Breed() {};

  Breed.refresh = function(callback) {
    _callback = callback;

    BreedAPI.list(function(data) {
      _table = data;
      _callback();
    });
  };

  Breed.all = function() {
    return _table;
  };

  Breed.find = function(id) {
    for (var i = 0; i < _table.length; i++) {
      var puppy = _table[i];
      if (puppy.id === id) {
        return puppy;
      }
    }
  };

  Breed.create = function(data) {
    BreedAPI.add(data, _callback);
  };

  Breed.destroy = function(id) {
    BreedAPI.remove(id, _callback);
  };

  return Breed;

})(BreedAPI, $);


"use strict";

var Puppy = (function(PuppyAPI, $) {

  var _table = [];

  var Puppy = function Puppy() {};

  Puppy.refresh = function(callback) {
    PuppyAPI.list(function(data) {
      _table = data;

      if (callback) {
        callback();
      }
    });
  };

  Puppy.all = function() {
    return _table;
  };

  Puppy.find = function(id) {
    for (var i = 0; i < _table.length; i++) {
      var puppy = _table[i];
      if (puppy.id === id) {
        return puppy;
      }
    }
  };

  Puppy.insert = function(puppy) {
    _table.push(puppy);
  };

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

  Puppy.create = function(data, callback) {
    PuppyAPI.add(data, callback);
  };

  Puppy.destroy = function(id, callback) {
    PuppyAPI.remove(id, callback);
    return this.remove(id);
  };

  Puppy.error = function() {
    return PuppyAPI.error;
  };

  return Puppy;

})(PuppyAPI, $);


var Session = require('./session');

var MemoryConnection = module.exports = function(options) {
  options = options || {};

  this.data = options.data;
  this.cache = {};
};

MemoryConnection.prototype.init = function(cb) {
  var self = this;

  setImmediate(function() {
    if (cb) {
      cb(null, self);
    }
  });
};

MemoryConnection.prototype.createSession = function() {
  return Session.create(this.data, this.cache);
};

MemoryConnection.prototype.close = function(cb) {
  var self = this;

  setImmediate(function() {
    if (cb) {
      cb();
    }
  });
};

MemoryConnection.create = function(options) {
  var connection = new MemoryConnection(options);
  return connection;
};

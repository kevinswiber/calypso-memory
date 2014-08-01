var Connection = require('./connection');

var MemoryDriver = module.exports = function(options) {
  this.options = options;
};

MemoryDriver.prototype.init = function(cb) {
  var connection = Connection.create(this.options);
  connection.init(cb);
};

MemoryDriver.create = function(options, cb) {
  var driver = new MemoryDriver(options);
  return driver;
};

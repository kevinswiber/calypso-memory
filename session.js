var MemoryCompiler = require('./compiler');

var MemorySession = module.exports = function(data, cache) {
  this.data = data;
  this.cache = cache || {};
};

MemorySession.prototype.find = function(query, cb) {
  if (typeof query === 'function') {
    cb = query;
    query = null;
  }

  if (!query) {
    query = 'select *';
  }

  var collection = query.modelConfig.collection;
  var db = this.data[collection];

  var compiler = new MemoryCompiler(this.cache);
  var compiled = compiler.compile(query.build(), query.modelConfig);

  var buffer = [];

  Object.keys(db).forEach(function(key) {
    var entry = db[key];
    var result;
    if (result = compiled.filterOne(entry)) {
      buffer.push(result);
    }
  });

  var sorted = compiled.sort(buffer);

  cb(null, sorted);
};

MemorySession.prototype.get = function(query, id, cb) {
  var collection = query.modelConfig.collection;
  var db = this.data[collection];

  var config = query.modelConfig;

  cb(null, db[id]);
};

MemorySession.create = function(data, cache) {
  return new MemorySession(data, cache);
};

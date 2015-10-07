var MemoryCompiler = require('./compiler');

var MemorySession = module.exports = function(data, cache) {
  this.data = data;
  this.cache = cache || {};
};

function convertToModel(config, entity, isBare) {
  var obj;
  if (isBare) {
    obj = entity;
  } else {
    obj = Object.create(config.constructor.prototype);
    var keys = Object.keys(config.fieldMap || {});
    if (keys.length === 0) {
      keys = Object.keys(entity);
    }
    keys.forEach(function(key) {
      var prop = config.fieldMap[key] || key;
      if (key.indexOf('.') === -1) {
        obj[key] = entity[prop];
      } else {
        var parts = prop.split('.');
        var part = parts.reduce(function(prev, cur) {
          if (Array.isArray(prev)) {
            return prev.map(function(item) {
              return item[cur];
            }); 
          } else if (prev.hasOwnProperty(cur)) {
            return prev[cur];
          }
        }, entity)

        obj[key] = part;
      }
    });
  }

  return obj;
}

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
      if (query.modelConfig.constructor)
      {
        if (compiled.fields.length > 0 && (compiled.fields[0].name !== '*' && compiled.fields[0] !== '*')) {
          buffer.push(result);
        } else {
          buffer.push(convertToModel(query.modelConfig, result, false));
        }
      } else {
        buffer.push(result);
      }
    }
  });

  var sorted = compiled.sort(buffer);

  cb(null, sorted);
};

MemorySession.prototype.get = function(query, id, cb) {
  var collection = query.modelConfig.collection;
  var db = this.data[collection];

  var config = query.modelConfig;

  var model = convertToModel(config, db[id], config.isBare); 
  cb(null, model);
};

MemorySession.create = function(data, cache) {
  return new MemorySession(data, cache);
};

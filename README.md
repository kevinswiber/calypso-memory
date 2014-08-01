# calypso-memory

An in-memory driver for [calypso](https://github.com/kevinswiber/calypso).

## Install

`npm install calypso-memory`

## Example

With query language:

```js
var calypso = require('calypso');
var MemoryDriver = require('./driver');
var Query = calypso.Query;

var driver = MemoryDriver.create({
  data: {
    'companies': {
      '1': { name: 'Postini', founded_year: 1999, total_money_raised: '$0' },
      '2': { name: 'Digg', founded_year: 2004, total_money_raised: '$45M' },
      '3': { name: 'Airbnb', founded_year: 2007, total_money_raised: '$120M' },
      '4': { name: 'TripIt', founded_year: 2006, total_money_raised: '$13.1M' },
      '5': { name: 'Twitter', founded_year: 2006, total_money_raised: '$1.16B' },
      '6': { name: 'Spotify', founded_year: 2006, total_money_raised: '$183M' },
      '7': { name: 'Airbnb', founded_year: 2008, total_money_raised: '$776.4M' }
    }
  }
});

var engine = calypso.configure({
  driver: driver
});

engine.build(function(err, connection) {
  var session = connection.createSession();

  var query = Query.of('companies')
    .ql('SELECT name, founded_year, total_money_raised AS worth ' +
        'WHERE founded_year >= @year AND name NOT LIKE @term ' +
        'ORDER BY founded_year DESC, name')
    .params({ year: 1999, term: '%air%' });

  session.find(query, function(err, companies) {
    console.log(companies);
    connection.close();
  });
});
```

With object mapping:

```js
var calypso = require('calypso');
var MemoryDriver = require('./driver');
var Query = calypso.Query;

var Company = function() {
  this.name = null;
  this.foundedYear = null;
  this.worth = null;
};

var companyMapping = function(config) {
  config.of(Company)
    .at('companies')
    .map('name')
    .map('foundedYear', { to: 'founded_year' })
    .map('worth', { to: 'total_money_raised' });
};

var driver = MemoryDriver.create({
  data: {
    'companies': {
      '1': { name: 'Postini', founded_year: 1999, total_money_raised: '$0' },
      '2': { name: 'Digg', founded_year: 2004, total_money_raised: '$45M' },
      '3': { name: 'Airbnb', founded_year: 2007, total_money_raised: '$120M' },
      '4': { name: 'TripIt', founded_year: 2006, total_money_raised: '$13.1M' },
      '5': { name: 'Twitter', founded_year: 2006, total_money_raised: '$1.16B' },
      '6': { name: 'Spotify', founded_year: 2006, total_money_raised: '$183M' },
      '7': { name: 'Airbnb', founded_year: 2008, total_money_raised: '$776.4M' }
    }
  }
});

var engine = calypso.configure({
  driver: driver,
  mappings: [companyMapping]
});

engine.build(function(err, connection) {
  var session = connection.createSession();

  var query = Query.of(Company)
    .ql('SELECT name, foundedYear, worth ' +
        'WHERE foundedYear >= @year AND name NOT LIKE @term ' +
        'ORDER BY foundedYear DESC, name')
    .params({ year: 1999, term: '%air%' });

  session.find(query, function(err, companies) {
    console.log(companies);
    connection.close();
  });
});
```

## License

MIT

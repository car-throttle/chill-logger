# Chill Logger

> Relax dude, your logs are covered

Working with Docker & ECS presents some interesting challenges & some interesting features, including application logs
[through Docker & Fluentd](https://docs.docker.com/engine/admin/logging/fluentd/). However this requires a specific
format to be printed out to *stdout*, so this module prints logs in a specific format for Fluentd to consume.

![Example output](./output.png)

In development, your logs are formatted slightly to add [color](https://www.npmjs.com/package/colors) (optionally) and
to add clearer spacing. In production they are minified (well, just not padded out) and line-by-line they will be sent
to Fluentd courtesy of the Docker logging driver.

## Installation

```
$ npm install --save chill-logger
```

If you would like colors when looking at logs during development, also include *colors* too:

```
$ npm install --save-dev colors
```

Without *colors*, your logs will be formatted into the same layout but there won't be any colors :cry:

## Usage

The easiest way to use this is to define a file for your logger:

```js
var logger = require('chill-logger')({
  name: 'my-awesome-project',
  level: process.env.LOG_LEVEL || 'debug' // Allows you to override it at runtime
});
```

More "advanced" usage could look like:

```js
// In logger.js
var logger = require('chill-logger');

module.exports = logger({
  name: 'my-awesome-project',
  level: process.env.LOG_LEVEL || 'debug' // Allows you to override it at runtime
});

module.exports.alert = function () {
  module.exports._send('alert', arguments);
};

// In another file
var logger = require('./logger')
logger.alert('Something needs someones attention!');
```

## API

```js
var log = require('chill-logger')();
// By default, the name for the logger is "log"
// And by default the log level is "debug", to allow everything through

log.debug('This is a debug statement');
// This will write the log line as "log.debug"

log.info('This is a simple INFO statement');
// This will write the log line as "log.info"

log.warn('This is a WARNING statement');
// This will write the log line as "log.warn"

log.error('This is an ERROR statement');
// This will write the log line as "log.error"

log.info({ state: {}, contents: [] });
// This will write the object as "log.info"

// You can optionally create types on demand:
log.info('location', { name: 'London' });
// This will write the object as "log.location"

// Or you can create functions to create new types, by passing arguments to the _send method:
log.alert = function () {
  log._send('alert', arguments);
};
// And then use it straight away!
log.alert('This is an ALERT statement');
```

### Errors

This logger will format errors into plain objects by passing them through the `formatErr` function that's provided.
You can override this method if you want to include additional properties:

```js
var logger = require('chill-logger');
var os = require('os');

module.exports = logger({
  name: 'my-awesome-project',
  level: process.env.LOG_LEVEL || 'debug' // Allows you to override it at runtime
});

logger.formatErr = function (err) {
  return {
    code: err.code || null,
    name: err.name,
    message: err.message,
    instance_id: os.hostname(),
    query: err.query || null,
    stack: err.stack
  };
};
```

## One more thing...

Feel free to [open an issue](https://github.com/car-throttle/chill-logger/issues), and this is an open-source project
so pull-requests are welcome!

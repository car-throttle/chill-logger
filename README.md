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

## One more thing...

Feel free to [open an issue](https://github.com/car-throttle/chill-logger/issues), and this is an open-source project
so pull-requests are welcome!

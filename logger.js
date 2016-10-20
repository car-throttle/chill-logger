var util = require('util');

function isObject(value) {
  return value != null && (typeof value === 'object' || typeof value === 'function');
}

function Chill(opts) {
  this.level = opts.level || 'info';
  this.prefix = opts.name + '.';
  this.stream = opts.stream || process.stdout;
}

Chill.prototype.debug = function () { return this._send('debug', arguments); };
Chill.prototype.info  = function () { return this._send('info',  arguments); };
Chill.prototype.warn  = function () { return this._send('warn',  arguments); };
Chill.prototype.error = function () { return this._send('error', arguments); };
Chill.prototype.fatal = function () { return this._send('fatal', arguments); };

var LEVELS = { debug: 10, trace: 15, info:  20, warn:  30, error: 50 };

Chill.prototype._send = function (level, args) {
  if (LEVELS[level] && LEVELS[level] < LEVELS[this.level]) return;
  var data = {};

  if (args[0] instanceof Error) {
    level = 'error';
    data = module.exports.formatErr(args[0]);
  }
  else if (args.length === 1 && isObject(args[0])) {
    data = JSON.parse(JSON.stringify(args[0]));
  }
  else if (args.length > 1 && typeof args[0] === 'string' && args[1] instanceof Error) {
    level = args[0].toLowerCase();
    data = module.exports.formatErr(args[1]);
  }
  else if (args.length > 1 && typeof args[0] === 'string' && isObject(args[1])) {
    level = args[0].toLowerCase();
    data = JSON.parse(JSON.stringify(args[1]));
  }
  else {
    data = { message: util.format.apply(util, args) };
  }

  return this._write(level, data);
};

Chill.prototype._write = function (tag, data) {
  this.stream.write(JSON.stringify([ this.prefix + tag, (new Date()).valueOf() / 1000, data ]) + '\n');
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') (function () {
  try {
    var colors = require('colors/safe');
    colors.setTheme({
      debug: [ 'yellow', 'dim' ],
      info: 'cyan',
      warn: 'yellow',
      error: 'red',
      fatal: [ 'red', 'bold' ],
      started: 'magenta'
    });

    Chill.prototype._write = function (tag, data) {
      this.stream.write(
        (colors[tag] ? colors[tag].call(colors, this.prefix + tag) : colors.debug(this.prefix + tag)) +
        ' [' + colors.magenta((new Date()).toISOString()) + ']\n' +
        util.inspect(data, { depth: 5 }) + '\n'
      );
    };
  }
  catch (e) {
    Chill.prototype._write = function (tag, data) {
      this.stream.write(
        this.prefix + tag + ' [' + (new Date()).toISOString() + ']\n' +
        util.inspect(data, { depth: 5 }) + '\n'
      );
    };
  }
})();

module.exports = function (opts) {
  return new Chill(opts);
};

module.exports.formatErr = function (err) {
  return {
    code: err.code || null,
    name: err.name || 'Error',
    message: err.message,
    stack: err.stack
  };
};

var assert = require('assert');
var rewire = require('rewire');

describe('Chill-Logger', function () {
  var logger = rewire('./logger');
  var Chill = logger.__get__('Chill');

  describe('#create', function () {
    it('should create a new instance of Logger', function () {
      var log = logger();
      assert.ok(log instanceof Chill);
      assert.equal(log.prefix, 'log.');
      assert.equal(log.level, 'debug');
    });

    it('should create a new instance of Logger with a name', function () {
      var log = logger({ name: 'awesome-logger' });
      assert.ok(log instanceof Chill);
      assert.equal(log.prefix, 'awesome-logger.');
      assert.equal(log.level, 'debug');
    });

    it('should create a new instance of Logger with a level', function () {
      var log = logger({ level: 'info' });
      assert.ok(log instanceof Chill);
      assert.equal(log.prefix, 'log.');
      assert.equal(log.level, 'info');
    });
  });

  describe('#formatErr', function () {
    it('should format an error correctly', function () {
      var err = new Error('Something old, something new');
      err.stack = 'ERROR-STACK';

      assert.deepEqual(logger.formatErr(err), {
        code: null,
        name: 'Error',
        message: 'Something old, something new',
        stack: 'ERROR-STACK'
      });
    });
  });

  describe('isObject', function () {
    var isObject = logger.__get__('isObject');

    it('should return true if an object is given', function () {
      assert.equal(isObject({}), true);
      assert.equal(isObject([]), true);
      assert.equal(isObject(new Error()), true);
      assert.equal(isObject(logger), true);
    });

    it('should return fakse if a not object is given', function () {
      assert.equal(isObject(), false);
    });
  });

  describe('logger', function () {
    var log = logger();
    log._write = function (tag, data) { return JSON.stringify([ this.prefix + tag, data ]); };

    it('should create debug messages', function () {
      assert.equal(log.debug('Hello, world!'), '["log.debug",{"message":"Hello, world!"}]');
    });

    it('should create info messages', function () {
      assert.equal(log.info('Hello, world!'), '["log.info",{"message":"Hello, world!"}]');
    });

    it('should create warn messages', function () {
      assert.equal(log.warn('Hello, world!'), '["log.warn",{"message":"Hello, world!"}]');
    });

    it('should create error messages', function () {
      assert.equal(log.error('Hello, world!'), '["log.error",{"message":"Hello, world!"}]');
    });

    it('should format errors', function () {
      var err = new Error('Something old, something new');
      err.stack = 'ERROR-STACK';

      assert.equal(log.error(err), '["log.error",{"code":null,"name":"Error","message":"Something old, ' +
        'something new","stack":"ERROR-STACK"}]');
    });

    it('should format objects', function () {
      assert.equal(log.info({ hello: 'world' }), '["log.info",{"hello":"world"}]');
    });

    it('should format errors with a tag', function () {
      var err = new Error('Something old, something new');
      err.stack = 'ERROR-STACK';

      assert.equal(log.info('something', err), '["log.something",{"code":null,"name":"Error","message":"Something ' +
        'old, something new","stack":"ERROR-STACK"}]');
    });

    it('should format objects with a tag', function () {
      assert.equal(log.info('something', { hello: 'world' }), '["log.something",{"hello":"world"}]');
    });

    it('should ignore logs under its level', function () {
      var log2 = logger({ level: 'info' });
      assert.equal(log2.debug({ hello: 'world' }), undefined);
    });
  });
});

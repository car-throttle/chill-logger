var assert = require('assert');
var rewire = require('rewire');

describe('Chill-Logger', function () {
  /* jshint maxlen:false */
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

  describe('middleware', function () {
    var output = [];
    var log = logger({ stream: { write: function (input) { output.push(input); } } });
    afterEach(function () {
      output = [];
    });

    var assertLog = function (fn, expected) {
      var actual;
      if (output.length) {
        actual = (output.shift() || '').split(',');
        actual.splice(1, 1);
        actual = actual.join(',').trim();
      }
      assert.equal(actual, expected);
    };

    var fakeReq = {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-language': 'en-GB,en;q=0.8,en-US;q=0.6',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
        dnt: '1',
        pragma: 'no-cache',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko ) Chrome/31.0.1650.63 Safari/537.36',
      },
      method: 'GET',
      path: '/',
      query: {},
      url: '/',
    };
    var fakeRes = {
      status: 200,
      headers: {
        'x-powered-by': 'love'
      },
      on: function (type, fn) {
        if (type === 'finish') return fn();
      },
      setHeader: function (header, value) {
        fakeRes.headers[header] = value;
      }
    };

    it('should create a middleware function', function () {
      var middleware = logger.middleware(log);
      assert.equal(middleware.length, 3);
    });

    var middleware = logger.middleware(log, {
      generateHeaderId: function () { return 'UUID'; },
    });

    it('should execute the middleware correctly', function (done) {
      middleware(fakeReq, fakeRes, function () {
        assertLog(null, '["log.req",{"id":"UUID","req":{"method":"GET","url":"/","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8","accept-language":"en-GB,en;q=0.8,en-US;q=0.6","cache-control":"no-cache","connection":"keep-alive","dnt":"1","pragma":"no-cache","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko ) Chrome/31.0.1650.63 Safari/537.36","x-request-id":"UUID"},"path":"/","qs":"{}","body":"{}"},"res":{"headers":{}}}]');
        done();
      });
    });
  });

  describe('logger', function () {
    var output = [];
    var log = logger({ stream: { write: function (input) { output.push(input); } } });
    afterEach(function () {
      output = [];
    });

    var assertLog = function (fn, expected) {
      var actual;
      if (output.length) {
        actual = (output.shift() || '').split(',');
        actual.splice(1, 1);
        actual = actual.join(',').trim();
      }
      assert.equal(actual, expected);
    };

    it('should create debug messages', function () {
      assertLog(log.debug('Hello, world!'), '["log.debug",{"message":"Hello, world!"}]');
    });

    it('should create info messages', function () {
      assertLog(log.info('Hello, world!'), '["log.info",{"message":"Hello, world!"}]');
    });

    it('should create warn messages', function () {
      assertLog(log.warn('Hello, world!'), '["log.warn",{"message":"Hello, world!"}]');
    });

    it('should create error messages', function () {
      assertLog(log.error('Hello, world!'), '["log.error",{"message":"Hello, world!"}]');
    });

    it('should format errors', function () {
      var err = new Error('Something old, something new');
      err.stack = 'ERROR-STACK';

      assertLog(log.error(err), '["log.error",{"code":null,"name":"Error","message":"Something old, something new","stack":"ERROR-STACK"}]');
    });

    it('should format objects', function () {
      assertLog(log.info({ hello: 'world' }), '["log.info",{"hello":"world"}]');
    });

    it('should format errors with a tag', function () {
      var err = new Error('Something old, something new');
      err.stack = 'ERROR-STACK';

      assertLog(log.info('something', err), '["log.something",{"code":null,"name":"Error","message":"Something old, something new","stack":"ERROR-STACK"}]');
    });

    it('should format objects with a tag', function () {
      assertLog(log.info('something', { hello: 'world' }), '["log.something",{"hello":"world"}]');
    });

    it('should ignore logs under its level', function () {
      var log2 = logger({ level: 'info' });
      assertLog(log2.debug({ hello: 'world' }), undefined);
    });

    it('should ignore all logs if the ignore-all level is passed', function () {
      var log2 = logger({ level: 'ignore-all' });
      assertLog(log2.error({ message: 'An important error here' }), undefined);
    });
  });
});

var assert = require('assert');
var rewire = require('rewire');

describe('Chill-Logger', function () {
  var logger = rewire('./logger');
  var Chill = logger.__get__('Chill');

  describe('#create', function () {
    it('should create a new instance of Logger', function () {
      assert.ok(logger.create() instanceof Chill);
    });
  });
});

'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validate error', function () {
	var errorsMessages = [{
		value: 1,
		field: 'body.value',
		message: 'This is wrong!'
	}];

	var error = new _error2.default(errorsMessages);

	it('should contain messages', function () {
		_assert2.default.equal(error.messages, errorsMessages);
	});

	it('should be instanceof Error', function () {
		_assert2.default.equal(error instanceof Error, true);
	});
});
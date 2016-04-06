'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validate error', function () {
	var errors = [{
		value: 1,
		field: 'body.value',
		error: 'This is wrong!'
	}];

	var error = new _error2.default(errors);

	it('should contain errors', function () {
		_assert2.default.equal(error.errors, errors);
	});

	it('should be instanceof Error', function () {
		_assert2.default.equal(error instanceof Error, true);
	});
});
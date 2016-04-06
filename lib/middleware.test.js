'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _middleware = require('./middleware.js');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('middleware', function () {
	var response = {};

	var validationRules = {
		body: {
			value: function value(_value) {
				return {
					'No value': _value
				};
			}
		}
	};

	it('should next without error', function (done) {
		var request = {
			body: {
				value: 1
			}
		};

		var middlewareFunction = (0, _middleware2.default)(validationRules);

		middlewareFunction(request, response, function (error) {
			_assert2.default.equal(error, null);
			done();
		});
	});

	it('should next with error', function (done) {
		var request = {
			body: {}
		};

		var middlewareFunction = (0, _middleware2.default)(validationRules);

		middlewareFunction(request, response, function (error) {
			_assert2.default.notEqual(error, null);
			done();
		});
	});
});
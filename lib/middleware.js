'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = middleware;

var _validate = require('./validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _error = require('./error.js');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function middleware(validationRules) {
	return function (request, response, next) {
		var errors = (0, _validate2.default)(request, validationRules);

		if (errors.length > 0) {
			next(new _error2.default(errors));
		} else {
			next();
		}
	};
}
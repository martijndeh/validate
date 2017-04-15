'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = validateMiddleware;

var _validate = require('./validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createError(errorMessages) {
	return _boom2.default.badRequest(errorMessages[0].message, {
		errorMessages: errorMessages
	});
}

function validateMiddleware(validationRules) {
	var createErrorFunction = arguments.length <= 1 || arguments[1] === undefined ? createError : arguments[1];

	return function (request, response, next) {
		var errorMessages = (0, _validate2.default)(request, validationRules);

		if (errorMessages.length > 0) {
			next(createErrorFunction(errorMessages));
		} else {
			next();
		}
	};
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = undefined;

var _middleware = require('./middleware.js');

var _middleware2 = _interopRequireDefault(_middleware);

var _validate = require('./validate.js');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _middleware2.default;
exports.validate = _validate2.default;
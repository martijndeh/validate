'use strict';

var _validate = require('./validate.js');

var _validate2 = _interopRequireDefault(_validate);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validate', function () {
	it('should validate without errors', function () {
		var request = {
			body: {
				value: 123
			}
		};

		var validationRules = {
			body: {
				value: function value(_value) {
					return {
						'Value must be greater than 42.': _value > 42
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 0);
	});

	it('should validate with 1 error', function () {
		var request = {
			body: {
				value: 1
			}
		};

		var validationRules = {
			body: {
				value: function value(_value2) {
					return {
						'Value must be greater than 42.': _value2 > 42
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 1);
		_assert2.default.deepEqual(errors[0], {
			field: 'body.value',
			value: 1,
			message: 'Value must be greater than 42.'
		});
	});

	it('should validate nested value', function () {
		var request = {
			body: {
				address: {
					streetName: 'Infinite Loop'
				}
			}
		};

		var validationRules = {
			body: {
				address: {
					streetName: function streetName(value) {
						return {
							'Please provider your street name.': value && value.length > 0
						};
					}
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 0);
	});

	it('should validate nested value with 1 error', function () {
		var request = {
			body: {
				address: {
					streetName: null
				}
			}
		};

		var validationRules = {
			body: {
				address: {
					streetName: function streetName(value) {
						return {
							'Please provide your street name.': value && value.length > 0
						};
					}
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 1);
		_assert2.default.deepEqual(errors[0], {
			field: 'body.address.streetName',
			value: null,
			message: 'Please provide your street name.'
		});
	});

	it('should validate multiple rules', function () {
		var request = {
			body: {
				value: 123
			}
		};

		var validationRules = {
			body: {
				value: function value(_value3) {
					return {
						'Value must exist!': _value3,
						'Value must be greater than 42.': _value3 > 42
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 0);
	});

	it('should validate multiple rules with 2 errors', function () {
		var request = {
			body: {
				value: null
			}
		};

		var validationRules = {
			body: {
				value: function value(_value4) {
					return {
						'Value must exist!': _value4,
						'Value must be greater than 42.': _value4 > 42
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 2);
	});

	it('should validate multiple properties', function () {
		var request = {
			body: {
				value: 123,
				name: 'Martijn'
			}
		};

		var validationRules = {
			body: {
				value: function value(_value5) {
					return {
						'Value must exist!': _value5
					};
				},
				name: function name(_name) {
					return {
						'Name must exist!': _name
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 0);
	});

	it('should validate multiple properties with 2 errors', function () {
		var request = {
			body: {
				value: -1,
				name: null
			}
		};

		var validationRules = {
			body: {
				value: function value(_value6) {
					return {
						'Value must not be -1!': _value6 !== -1
					};
				},
				name: function name(_name2) {
					return {
						'Name must exist!': _name2
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.deepEqual(errors, [{
			message: 'Value must not be -1!',
			field: 'body.value',
			value: -1
		}, {
			message: 'Name must exist!',
			field: 'body.name',
			value: null
		}]);
	});

	it('should validate with empty body', function () {
		var request = {
			body: {}
		};

		var validationRules = {
			body: {
				value: function value(_value7) {
					return {
						'Value must not be -1!': _value7 !== -1
					};
				},
				name: function name(_name3) {
					return {
						'Name must exist!': _name3
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.deepEqual(errors, [{
			message: 'Name must exist!',
			field: 'body.name',
			value: undefined
		}]);
	});

	it('should validate without body', function () {
		var request = {};

		var validationRules = {
			body: {
				value: function value(_value8) {
					return {
						'Value must not be -1!': _value8 !== -1
					};
				},
				name: function name(_name4) {
					return {
						'Name must exist!': _name4
					};
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.deepEqual(errors, [{
			message: 'Name must exist!',
			field: 'body.name',
			value: undefined
		}]);
	});

	it('should validate without body and with nested validations', function () {
		var request = {};

		var validationRules = {
			body: {
				address: {
					streetName: function streetName(_streetName) {
						return {
							'No street name!': _streetName
						};
					}
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.deepEqual(errors, [{
			message: 'No street name!',
			field: 'body.address.streetName',
			value: undefined
		}]);
	});

	it('should validate with nested validations and invalid input', function () {
		var request = {
			body: {
				address: null
			}
		};

		var validationRules = {
			body: {
				address: {
					streetName: function streetName(_streetName2) {
						return {
							'No street name!': _streetName2 && _streetName2.length > 0
						};
					}
				}
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.deepEqual(errors, [{
			message: 'No street name!',
			field: 'body.address.streetName',
			value: undefined
		}]);
	});

	it('should throw error if validation rule is null', function () {
		var request = {
			body: {
				address: true
			}
		};

		var validationRules = {
			body: {
				address: null
			}
		};

		_assert2.default.throws(function () {
			(0, _validate2.default)(request, validationRules);
		}, Error);
	});

	it('should throw error if validation rule is string', function () {
		var request = {
			body: {
				address: {
					streetName: 'Infinite Loop'
				}
			}
		};

		var validationRules = {
			body: {
				address: 'Address'
			}
		};

		_assert2.default.throws(function () {
			(0, _validate2.default)(request, validationRules);
		}, Error);
	});

	it('should throw error if validator function returns non-object', function () {
		var request = {
			body: {
				address: {
					streetName: 'Infinite Loop'
				}
			}
		};

		var validationRules = {
			body: {
				streetName: function streetName() {
					return 42;
				}
			}
		};

		_assert2.default.throws(function () {
			(0, _validate2.default)(request, validationRules);
		}, Error);
	});

	it('should validate on root', function () {
		var request = {
			name: 'Martijn'
		};

		var validationRules = {
			name: function name(_name5) {
				return {
					'The name is wrong.': _name5 === 'Martijn'
				};
			}
		};

		var errors = (0, _validate2.default)(request, validationRules);
		_assert2.default.equal(errors.length, 0);
	});
});
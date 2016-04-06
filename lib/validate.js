'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = validate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validate(root, validationRules) {
	var errors = [];

	var $validate = function $validate(targetObject, parents, fields, checks) {
		if (!checks || (typeof checks === 'undefined' ? 'undefined' : _typeof(checks)) !== 'object') {
			throw new Error('The validation rule in ' + fields.join('.') + ' is invalid.');
		}

		Object.keys(checks).forEach(function (field) {
			if (_typeof(checks[field]) === 'object') {
				var childObject = {};
				if (targetObject && (typeof targetObject === 'undefined' ? 'undefined' : _typeof(targetObject)) === 'object') {
					var value = targetObject[field];
					if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
						childObject = value;
					}
				}

				// Recursively validate!
				$validate(childObject, [targetObject].concat(_toConsumableArray(parents)), [].concat(_toConsumableArray(fields), [field]), checks[field]);
			} else {
				(function () {
					// This is the validator function which returns an object of validations.
					var validatorFunction = checks[field];

					// This is e.g. request.body.email, or something nested, like
					// request.body.address.streetName
					var value = targetObject[field];

					// The validator function returns an object of validations. Every key is an error
					// message and each value is the result of the validation.
					var validations = validatorFunction.apply(undefined, [value, targetObject].concat(_toConsumableArray(parents)));

					if (!validations || (typeof validations === 'undefined' ? 'undefined' : _typeof(validations)) !== 'object') {
						throw new Error('The validator function in \'' + [].concat(_toConsumableArray(fields), [field]).join('.') + ' returns invalid validations. Instead, it should return an object with error messages as keys and validation rules as values (where valid is true and invalid is false).');
					}

					Object.keys(validations).forEach(function (errorMessage) {
						// The result of the validation. True means the validation passes and false means
						// the validation fails.
						var result = validations[errorMessage];

						if (!result) {
							errors.push({
								field: [].concat(_toConsumableArray(fields), [field]).join('.'),
								value: value,
								error: errorMessage
							});
						}
					});
				})();
			}
		});
	};

	Object.keys(validationRules).forEach(function (key) {
		// Key is body or query. So this is e.g. request.body.
		var targetObject = root[key] || {};

		// This is an object with keys and validatorFunctions.
		var checks = validationRules[key];

		// And we validate!
		$validate(targetObject, [root], [key], checks);
	});

	return errors;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = validate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function validate(root, validationRules) {
	var errorMessages = [];

	var $validate = function $validate(targetObject, parents, fields, checks) {
		if (!checks || (typeof checks === 'undefined' ? 'undefined' : _typeof(checks)) !== 'object') {
			throw new Error('The validation rule in ' + fields.join('.') + ' is invalid.');
		}

		Object.keys(checks).forEach(function (check) {
			var _check$split = check.split('.');

			var _check$split2 = _slicedToArray(_check$split, 2);

			var field = _check$split2[0];
			var property = _check$split2[1];


			if (property) {
				$validate(targetObject[field], parents, fields, _defineProperty({}, property, checks[check]));
			} else if (Array.isArray(checks[field])) {
				(function () {
					var arrayCheck = checks[field];

					if (arrayCheck.length !== 1) {
						throw new Error('The checks array ' + [].concat(_toConsumableArray(fields), [field]).join('.') + ' should contain exactly one validator function.');
					}

					var array = targetObject[field];

					if (array && Array.isArray(array)) {
						array.forEach(function (object, index) {
							$validate(object, [array, targetObject].concat(_toConsumableArray(parents)), [].concat(_toConsumableArray(fields), [field, String(index)]), arrayCheck[0]);
						});
					}
				})();
			} else if (_typeof(checks[field]) === 'object') {
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
						throw new Error('The validator function in \'' + [].concat(_toConsumableArray(fields), [field]).join('.') + '\' returns invalid validations. Instead, it should return an object with error messages as keys and validation rules as values (where valid is true and invalid is false). It returned ' + validations + '.');
					}

					Object.keys(validations).forEach(function (errorMessage) {
						// The result of the validation. True means the validation passes and false means
						// the validation fails.
						var result = validations[errorMessage];

						if (!result) {
							errorMessages.push({
								field: [].concat(_toConsumableArray(fields), [field]).join('.'),
								value: value,
								message: errorMessage
							});
						}
					});
				})();
			}
		});
	};

	$validate(root, [], [], validationRules);
	return errorMessages;
}
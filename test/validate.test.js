import validate from '../src/validate.js';
import assert from 'assert';

describe('validate', () => {
	it('should validate without errors', () => {
		const request = {
			body: {
				value: 123,
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must be greater than 42.': value > 42,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate with 1 error', () => {
		const request = {
			body: {
				value: 1,
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must be greater than 42.': value > 42,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 1);
		assert.deepEqual(errors[0], {
			field: 'body.value',
			value: 1,
			message: 'Value must be greater than 42.',
		});
	});

	it('should validate nested value', () => {
		const request = {
			body: {
				address: {
					streetName: 'Infinite Loop',
				},
			},
		};

		const validationRules = {
			body: {
				address: {
					streetName: (value) => ({
						'Please provider your street name.': value && value.length > 0,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate nested value which is not an object', () => {
		const request = {
			body: {
				address: 'test',
			},
		};

		const validationRules = {
			body: {
				address: {
					streetName: (value) => ({
						'Please provider your street name.': value && value.length > 0,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 1);
	});

	it('should validate nested value which is not in the root object', () => {
		const request = 'test';

		const validationRules = {
			body: {
				address: {
					streetName: (value) => ({
						'Please provider your street name.': value && value.length > 0,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 1);
	});

	it('should validate nested value with 1 error', () => {
		const request = {
			body: {
				address: {
					streetName: null,
				},
			},
		};

		const validationRules = {
			body: {
				address: {
					streetName: (value) => ({
						'Please provide your street name.': value && value.length > 0,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 1);
		assert.deepEqual(errors[0], {
			field: 'body.address.streetName',
			value: null,
			message: 'Please provide your street name.',
		});
	});

	it('should validate multiple rules', () => {
		const request = {
			body: {
				value: 123,
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must exist!': value,
					'Value must be greater than 42.': value > 42,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate multiple rules with 2 errors', () => {
		const request = {
			body: {
				value: null,
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must exist!': value,
					'Value must be greater than 42.': value > 42,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 2);
	});

	it('should validate multiple properties', () => {
		const request = {
			body: {
				value: 123,
				name: 'Martijn',
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must exist!': value,
				}),
				name: (name) => ({
					'Name must exist!': name,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate multiple properties with 2 errors', () => {
		const request = {
			body: {
				value: -1,
				name: null,
			},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must not be -1!': value !== -1,
				}),
				name: (name) => ({
					'Name must exist!': name,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.deepEqual(errors, [{
			message: 'Value must not be -1!',
			field: 'body.value',
			value: -1,
		}, {
			message: 'Name must exist!',
			field: 'body.name',
			value: null,
		}]);
	});

	it('should validate with empty body', () => {
		const request = {
			body: {},
		};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must not be -1!': value !== -1,
				}),
				name: (name) => ({
					'Name must exist!': name,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.deepEqual(errors, [{
			message: 'Name must exist!',
			field: 'body.name',
			value: undefined,
		}]);
	});

	it('should validate without body', () => {
		const request = {};

		const validationRules = {
			body: {
				value: (value) => ({
					'Value must not be -1!': value !== -1,
				}),
				name: (name) => ({
					'Name must exist!': name,
				}),
			},
		};

		const errors = validate(request, validationRules);
		assert.deepEqual(errors, [{
			message: 'Name must exist!',
			field: 'body.name',
			value: undefined,
		}]);
	});

	it('should validate without body and with nested validations', () => {
		const request = {};

		const validationRules = {
			body: {
				address: {
					streetName: (streetName) => ({
						'No street name!': streetName,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.deepEqual(errors, [{
			message: 'No street name!',
			field: 'body.address.streetName',
			value: undefined,
		}]);
	});

	it('should validate with nested validations and invalid input', () => {
		const request = {
			body: {
				address: null,
			},
		};

		const validationRules = {
			body: {
				address: {
					streetName: (streetName) => ({
						'No street name!': streetName && streetName.length > 0,
					}),
				},
			},
		};

		const errors = validate(request, validationRules);
		assert.deepEqual(errors, [{
			message: 'No street name!',
			field: 'body.address.streetName',
			value: undefined,
		}]);
	});

	it('should throw error if validation rule is null', () => {
		const request = {
			body: {
				address: true,
			},
		};

		const validationRules = {
			body: {
				address: null,
			},
		};

		assert.throws(() => {
			validate(request, validationRules);
		}, Error);
	});

	it('should throw error if validation rule is string', () => {
		const request = {
			body: {
				address: {
					streetName: 'Infinite Loop',
				},
			},
		};

		const validationRules = {
			body: {
				address: 'Address',
			},
		};

		assert.throws(() => {
			validate(request, validationRules);
		}, Error);
	});

	it('should throw error if validator function returns non-object', () => {
		const request = {
			body: {
				address: {
					streetName: 'Infinite Loop',
				},
			},
		};

		const validationRules = {
			body: {
				streetName: () => 42,
			},
		};

		assert.throws(() => {
			validate(request, validationRules);
		}, Error);
	});

	it('should validate on root', () => {
		const request = {
			name: 'Martijn',
		};

		const validationRules = {
			name:  (name) => ({
				'The name is wrong.': name === 'Martijn',
			}),
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate array of strings', () => {
		const request = {
			strings: ['A', 'B', 'C'],
		};

		const validationRules = {
			strings: (strings) => ({
				'Not enough strings.': strings.length === 3,
			}),
		};

		const errors = validate(request, validationRules);
		assert.equal(errors.length, 0);
	});

	it('should validate length of array', () => {
		const request = {
			objects: [
				{name: 'A'},
				{name: 'B'},
				{name: 'C'},
			],
		};
		const validationRules = {
			'objects.length': (length) => ({
				'There should be 3 items.': length === 3,
			}),
		};
		const errors = validate(request, validationRules);

		assert.equal(errors.length, 0);
	});

	it('should validate items of array', () => {
		const request = {
			objects: [
				{name: 'A'},
				{name: 'B'},
				{name: 'C'},
			],
		};

		const validationRules = {
			objects: [{
				name: (name) => ({
					'There should be a name!': name.length > 0,
				}),
			}],
		};

		const errors = validate(request, validationRules);

		assert.equal(errors.length, 0);
	});

	it('should invalidate items of array', () => {
		const request = {
			objects: [
				{name: 'A'},
				{name: 'B'},
				{name: 'C'},
			],
		};

		const validationRules = {
			objects: [{
				name: (name) => ({
					'There should be a name!': name.length > 0,
				}),

				description: (description) => ({
					'Should not be empty!': description && description.length > 0,
				}),
			}],
		};

		const errors = validate(request, validationRules);

		assert.equal(errors.length, 3);
	});

	it('should not check null array', () => {
		const request = {
			objects: null,
		};

		const validationRules = {
			objects: [{
				name: (name) => ({
					'There should be a name!': name.length > 0,
				}),
			}],
		};

		const errors = validate(request, validationRules);

		assert.equal(errors.length, 0);
	});

	it('should throw invalid number of checks', () => {
		const request = {};
		const validationRules = {
			array: [],
		};

		assert.throws(() => {
			validate(request, validationRules);
		});
	});
});

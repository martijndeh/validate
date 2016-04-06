import validate from './validate.js';
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
			error: 'Value must be greater than 42.',
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
			error: 'Please provide your street name.',
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
			error: 'Value must not be -1!',
			field: 'body.value',
			value: -1,
		}, {
			error: 'Name must exist!',
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
			error: 'Name must exist!',
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
			error: 'Name must exist!',
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
			error: 'No street name!',
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
			error: 'No street name!',
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
});

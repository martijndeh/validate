import assert from 'assert';
import ValidateError from './error.js';

describe('validate error', () => {
	const errors = [{
		value: 1,
		field: 'body.value',
		error: 'This is wrong!',
	}];

	const error = new ValidateError(errors);

	it('should contain errors', () => {
		assert.equal(error.errors, errors);
	});

	it('should be instanceof Error', () => {
		assert.equal(error instanceof Error, true);
	});
});

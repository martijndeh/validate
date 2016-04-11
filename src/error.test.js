import assert from 'assert';
import ValidateError from './error.js';

describe('validate error', () => {
	const errorsMessages = [{
		value: 1,
		field: 'body.value',
		error: 'This is wrong!',
	}];

	const error = new ValidateError(errorsMessages);

	it('should contain messages', () => {
		assert.equal(error.messages, errorsMessages);
	});

	it('should be instanceof Error', () => {
		assert.equal(error instanceof Error, true);
	});
});

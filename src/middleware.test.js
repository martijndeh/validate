import assert from 'assert';
import middleware from './middleware.js';

describe('middleware', () => {
	const response = {};

	const validationRules = {
		body: {
			value: (value) => ({
				'No value': value,
			}),
		},
	};

	it('should next without error', (done) => {
		const request = {
			body: {
				value: 1,
			},
		};

		const middlewareFunction = middleware(validationRules);

		middlewareFunction(request, response, (error) => {
			assert.equal(error, null);
			done();
		});
	});

	it('should next with error', (done) => {
		const request = {
			body: {},
		};

		const middlewareFunction = middleware(validationRules);

		middlewareFunction(request, response, (error) => {
			assert.notEqual(error, null);
			done();
		});
	});
});

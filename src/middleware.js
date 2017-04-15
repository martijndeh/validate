import validate from './validate.js';
import Boom from 'boom';

function createError(errorMessages) {
	return Boom.badRequest(errorMessages[0].message, {
		errorMessages,
	});
}

export default function validateMiddleware(validationRules, createErrorFunction = createError) {
	return (request, response, next) => {
		const errorMessages = validate(request, validationRules);

		if (errorMessages.length > 0) {
			next(createErrorFunction(errorMessages));
		}
		else {
			next();
		}
	};
}

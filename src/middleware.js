import validate from './validate.js';
import ValidateError from './error.js';

export default function validateMiddleware(validationRules) {
	return (request, response, next) => {
		const errorMessages = validate(request, validationRules);

		if (errorMessages.length > 0) {
			next(new ValidateError(errorMessages));
		}
		else {
			next();
		}
	};
}

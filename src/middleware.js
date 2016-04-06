import validate from './validate.js';
import ValidateError from './error.js';

export default function middleware(validationRules) {
	return (request, response, next) => {
		const errors = validate(request, validationRules);

		if (errors.length > 0) {
			next(new ValidateError(errors));
		}
		else {
			next();
		}
	};
}

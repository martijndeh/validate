export default class ValidateError extends Error {
	constructor(errors) {
		super();

		this.statusCode = 400;
		this.errors = errors;
	}
}

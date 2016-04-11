export default class ValidateError extends Error {
	constructor(errorMessages) {
		super();

		this.statusCode = 400;
		this.messages = errorMessages;
	}
}

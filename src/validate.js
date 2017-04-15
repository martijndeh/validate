export default function validate(root, validationRules) {
	const errorMessages = [];

	const $validate = (targetObject, parents, fields, checks) => {
		if (!checks || typeof checks !== 'object') {
			throw new Error(`The validation rule in ${fields.join('.')} is invalid.`);
		}

		Object.keys(checks).forEach((check) => {
			const [
				field,
				property,
			] = check.split('.');

			if (property) {
				$validate(targetObject[field], parents, fields, {
					[property]: checks[check],
				});
			}
			else if (Array.isArray(checks[field])) {
				const arrayCheck = checks[field];

				if (arrayCheck.length !== 1) {
					throw new Error(`The checks array ${[...fields, field].join('.')} should contain exactly one validator function.`);
				}

				const array = targetObject[field];

				if (array && Array.isArray(array)) {
					array.forEach((object, index) => {
						$validate(object, [array, targetObject, ...parents], [...fields, field, String(index)], arrayCheck[0]);
					});
				}
			}
			else if (typeof checks[field] === 'object') {
				let childObject = {};
				if (targetObject && typeof targetObject === 'object') {
					const value = targetObject[field];
					if (value && typeof value === 'object') {
						childObject = value;
					}
				}

				// Recursively validate!
				$validate(childObject, [targetObject, ...parents], [...fields, field], checks[field]);
			}
			else {
				// This is the validator function which returns an object of validations.
				const validatorFunction = checks[field];

				// This is e.g. request.body.email, or something nested, like
				// request.body.address.streetName
				const value = targetObject[field];

				// The validator function returns an object of validations. Every key is an error
				// message and each value is the result of the validation.
				const validations = validatorFunction(value, targetObject, ...parents);

				if (!validations || typeof validations !== 'object') {
					throw new Error(`The validator function in '${[...fields, field].join('.')}' returns invalid validations. Instead, it should return an object with error messages as keys and validation rules as values (where valid is true and invalid is false). It returned ${validations}.`);
				}

				Object.keys(validations).forEach((errorMessage) => {
					// The result of the validation. True means the validation passes and false means
					// the validation fails.
					const result = validations[errorMessage];

					if (!result) {
						errorMessages.push({
							field: [...fields, field].join('.'),
							value: value,
							message: errorMessage,
						});
					}
				});
			}
		});
	};

	$validate(root, [], [], validationRules);
	return errorMessages;
}

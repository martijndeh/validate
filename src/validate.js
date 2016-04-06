export default function validate(root, validationRules) {
	const errors = [];

	const $validate = (targetObject, parents, fields, checks) => {
		if (!checks || typeof checks !== 'object') {
			throw new Error(`The validation rule in ${fields.join('.')} is invalid.`);
		}

		Object.keys(checks).forEach((field) => {
			if (typeof checks[field] === 'object') {
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
					throw new Error(`The validator function in '${[...fields, field].join('.')} returns invalid validations. Instead, it should return an object with error messages as keys and validation rules as values (where valid is true and invalid is false).`);
				}

				Object.keys(validations).forEach((errorMessage) => {
					// The result of the validation. True means the validation passes and false means
					// the validation fails.
					const result = validations[errorMessage];

					if (!result) {
						errors.push({
							field: [...fields, field].join('.'),
							value: value,
							error: errorMessage,
						});
					}
				});
			}
		});
	};

	Object.keys(validationRules)
		.forEach((key) => {
			// Key is body or query. So this is e.g. request.body.
			const targetObject = root[key] || {};

			// This is an object with keys and validatorFunctions.
			const checks = validationRules[key];

			// And we validate!
			$validate(targetObject, [root], [key], checks);
		});

	return errors;
}

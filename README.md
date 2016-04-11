# Validate
[![Build Status](https://travis-ci.org/martijndeh/validate.svg?branch=master)](https://travis-ci.org/martijndeh/validate)
[![Coverage Status](https://coveralls.io/repos/github/martijndeh/validate/badge.svg?branch=master)](https://coveralls.io/github/martijndeh/validate?branch=master)

A lightweight express middleware to easily validate user input in requests.

```js
import validateMiddleware from 'express-validate-system';

const validationRules = {
	body: {
		email: (email) => ({
			'Please provide an email.': email,
			'Invalid email, yo!': email && email.indexOf('@') !== -1,
		}),
		password: (password) => ({
			'No password.': password,
			'Eeks, your password is not long enough.': password && password.length > 6,
		}),
	},
};

app.post('/api/users', validateMiddleware(validationRules), (request, response) => {
	// Create the user here.
});

app.use((error, request, response, next) => {
	// The error middleware should handle the response.
});
```

## Validation Rules

To validate requests, you need to pass validation rules to the `validate` middleware. The rules per property are a validator function. A validator function returns an object with one or more error messages as keys and the validation as value where true if valid and false invalid.

For example, the following creates a rule on `body.email` which validates if the email exists and if it's valid (valid as in an @ exists):

```js
const validationRules = {
	// The scope of the validation rule is request.body.
	body: {
		// We want to validate the email property on the body. We create a validator function which returns an object with multiple error messages and the validation result as value (where true is valid and false is invalid).
		email: (email) => ({
			// Check if the email exists.
			'Please provide your email.': email,
			// Check if the email contains an @ character.
			'Please provide a valid email.': email && email.indexOf('@') !== -1,
		}),
	},
};
```

Now, if a request with the body `{ email: null }` is parsed, the validate will call the validator function and parse the object. `'Please provide your email.': email,` will be false and thus `email` is considered invalid. `validate` will continue parsing all validation rules. `'Please provide a valid email.': email && email.indexOf('@') !== -1,` will also be false and thus again invalid.

### Nested Rules

You can also nest validation rules. This makes it easier to validate nested properties. The below snippet creates a validate rule for `request.body.address.streetName` and `request.body.address.postalCode`:

```js
const validationRules = {
	body: {
		address: {
			streetName: (streetName) => ({
				'Please fill in your street.': streetName,
			}),
			postalCode: (postalCode) => ({
				'Please fill in your postal code.': postalCode,
			}),
		},
	},
};
```

### Query

You can validate more than the `request.body`. To validate `request.query` simply create the appropriate validation rules:

```js
const validationRules = {
	query: {
		text: (text) => ({
			'Please enter the text.': text,
			'Please make sure the text is longer than 200 characters.': text.length > 200,
		}),
	},
};
```

### References

You can also reference other properties. The validator function's arguments contain all parent objects up to the root object (the request).

```js
const validationRules = {
	body: {
		value: (value) => ({
			'Value must be bigger than 42.': value > 42,
		}),
		otherValue: (math, body, request) => ({
			'The other value should be smaller than value.': otherValue < body.value,
		}),
	},
};
```

## Validate

You can also use the `validate` function directly without using the middleware. Pass the validation rules to `validate` and it returns an array with one or more error descriptions.

```js
import { validate } from 'express-validate-system';

const errors = validate(validationRules);
```

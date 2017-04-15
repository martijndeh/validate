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
			'Invalid email.': email && email.indexOf('@') !== -1,
		}),
		password: (password) => ({
			'No password provided.': password,
			'Your password is not long enough.': password && password.length > 6,
		}),
	},
};

app.post('/api/users', validateMiddleware(validationRules), (request, response) => {
	// TODO: Create the user here. request.body.email and request.body.password are validated based on the rules in validationRules because of the validateMiddleware.
});

app.use((error, request, response, next) => {
	// The error middleware should handle the response. `error` is a Boom#badRequest error with an array of errorMessages in it's data property.
});
```

## Validation Rules

To validate requests, you need to pass validation rules to the `validate` middleware. The rules per property are a validator function. A validator function returns an object with one or more error messages as keys and the validation as value where `true` is valid and `false` invalid.

For example, the following creates a rule on `body.email` which validates if the email exists and if it's valid (valid as in an @ exists, this is for demonstration purposes only):

```js
const validationRules = {
	// The scope of the validation rule is request.body. You could just as well validate request.query, if you want.
	body: {
		// We want to validate the email property on the body. We
		// create a validator function which returns an object with
		// multiple error messages and the validation result as
		// value (where true is valid and false is invalid).
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

### Arrays

You can also validate all items in an array.

```js
const validationRules = {
	body: {
		list: [{
			name: (name) => ({
				'Name should be set': name,
			}),
		}],
		'list.length': (length) => ({
			'There should be 3 items in the list.': length === 3,
		}),
	}
}
```

The will also check the length of the list in request's body. You can use the dot notation to check specific properties.

### References

You can also reference other properties. The validator function's arguments contain all parent objects up to the root object (the request).

```js
const validationRules = {
	body: {
		value: (value) => ({
			'Value must be bigger than 42.': value > 42,
		}),
		otherValue: (otherValue, body, request) => ({
			'The other value should be smaller than value.': otherValue < body.value,
		}),
	},
};
```

### Custom errors

Since version 2.0 this library passes Boom errors to the next callback. To create your own errors, pass a callback to the `validateMiddleware` which creates error messages.

```js
const middleware = validateMiddleware({
	body: {
		test: (test) => ({
			'Test should be set to 123.': test === 123,
		}),
	},
}, (errorMessages) => new Error('This is my custom error.'));
```

## Validate

You can also use the `validate` function directly without using the middleware. Pass the validation rules to `validate` and it returns an array with one or more error messages.

```js
import { validate } from 'express-validate-system';

const errorMessages = validate(validationRules);
```

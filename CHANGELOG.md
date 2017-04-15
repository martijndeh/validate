## 2.0 (15-04-2017)

### Breaking changes

- Pass Boom#badRequest error instead of the internal ValidateError.

### Features

- Able to pass a create error callback to the middleware to create your own errors.
- Validate items of an array using the array notation.
- Use the dot notation to validate specific properties of an item.

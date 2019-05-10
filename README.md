# Swagger Route Validator

- An extremely fast and efficient module to validate incoming requests against a swagger specification.

## Some caveats

- Limited Swagger specifications support
- Requires a spec that is already compiled and has resolved json-refs
- Requires that the route to validate be passed, not the entire spec

## Usage

```javascript

// Code for a request validation middleware
const validate = require('swagger-route-validator');
const spec = require('./my-spec');

function validateRequest(req, res) {
    const matchingSpec = spec[req.route.path] && [req.method];
    
    // Path not in specs
    if (!matchingSpec) return res.status(400).json('Path could not be validated');

    // Check validation errors
    const errors = validate(matchingSpec, req);
    if (errors.lenght > 0) return res.status(400).json(errors);
}

module.exports = validateRequest;

```

## Running tests

```
npm run test
```

## License

[Apache 2.0](./LICENSE) - Shutterstock, Frederic Charette
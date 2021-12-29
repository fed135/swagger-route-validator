# Swagger Route Validator

- An extremely fast and efficient module to validate and format incoming requests against a swagger specification.
  - 5x to 10x more throughput
  - 10x to 12x more memory efficient
  - 10x to 20x less cpu usage than [sway](https://www.npmjs.com/package/sway), the next fastest alternative
- Zero dependencies :star:
- Battle-tested by Fortune 500 companies

## Roadmap

- Add missing OpenAPI 3.0 features
  - [Schema object references](https://swagger.io/specification/#schema-object)
  - `$allOf`
  - `$oneOf`
  - `$anyOf`
  - `$not`
- Add support for these attributes
  - `nullable`
  - `additionalProperties`


## Usage

This middleware example has the spec for that exact route passed as an argument

```javascript

// Code for a request validation middleware
const validate = require('swagger-route-validator');
const spec = require('./my-spec');

function validationMiddleware(routeSpec) {
    return function validateRequest(req, res, next) {

        // Check validation errors
        const errors = validate(routeSpec, req);
        if (errors.length > 0) return res.status(400).json(errors);

        next();
    }
}

module.exports = validationMiddleware;

```


This middleware example takes in the entire swagger spec and tries to find the route in it.

```javascript

// Code for a request validation middleware
const validate = require('swagger-route-validator');
const spec = require('./my-spec');

function validateRequest(req, res, next) {
    const layer = app._router.stack.find(bloc => bloc.route && bloc.regexp.exec(req.originalUrl) !== null);
    
    // Check if route exists
    if (!layer) return next();

    // prevents routing from running twice:
    req.route = layer.route;

    function extractPathParams(url, layer) {
        const parameters = {};

        if (layer.keys.length > 0) {
            const cleanedInbound = url.split('/');
            const cleanedOriginal = layer.route.path.split('/');
            let keysIndex = 0;
            for (let i = 0; i < cleanedInbound.length; i++) {
                if (!layer.keys[keysIndex]) continue;
                if (cleanedInbound[i] !== cleanedOriginal[i]) {
                    parameters[layer.keys[keysIndex].name] = cleanedInbound[i];
                    keysIndex++;
                }
            }
        }
        return parameters;
    }

    const matchingSpec = spec[layer.route.path] && spec[layer.route.path][req.method.toLowerCase()];
    
    // Path not in specs
    if (!matchingSpec) return next();

    Object.assign(req.params, extractPathParams(req.originalUrl, layer));

    // Check validation errors
    const errors = validate(matchingSpec, req);
    if (errors.length > 0) return res.status(400).json(errors);

    next();
}

module.exports = validateRequest;

```

## Running tests

```
npm run test
```

## License

[Apache 2.0](./LICENSE) - Frederic Charette
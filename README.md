# Swagger Route Validator

- An extremely fast and efficient module to validate and format incoming requests against a swagger specification.
- 5 to 10x more throughput, 10 to 12x more memory efficient and 10 to 20x less cpu usage than `sway`, the fastest alternative

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
    const errors = srv(matchingSpec, req);
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

[Apache 2.0](./LICENSE) - Shutterstock, Frederic Charette
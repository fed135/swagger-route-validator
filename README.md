<h1 align="center">
  <a title="Swagger Route Validator" href="https://github.com/fed135/swagger-route-validator">
    <img alt="logo" width="300px" src="./srv.png" />
    <br/>
  </a>
  Swagger Route Validator
</h1>
<br/>

---

- The fastest request/response validator for OpenAPI applications
- Zero dependencies :star:
- Battle-tested by Fortune 500 companies
- Supports OpenAPI 3.X features like $ref, $not, $anyOf, $allOf, $oneOf, etc.
- Supports most common data formats like emails, ips, uuids, dates, etc.
- Supports Express 4.x and 5.x
- Uses OpenAPI/ Swagger specs as Objects. Say goodbye to YAML files!

---

## Usage

### Request validation

SRV offers a built-in express middleware for easy integration:

```javascript
import {expressRequestValidation} from 'swagger-route-validator';
import express from 'express';

const app = express();

app.get('/foo', expressRequestValidation(/* An object with your route's spec */), (req, res, next) => {
  res.send('Hello World!');
});

```

You may also run validations directly:

```javascript
import {validateRequest} from 'swagger-route-validator';


const errors = validateRequest(/* An object with your route's spec */, req);
if (errors.length > 0) throw new Error(`Request object does not match the specification for this route: ${errors.toString()}`);

```

Finally, if you want to put the validation middleware earlier in the stack (before routing) you could follow [this example](https://gist.github.com/fed135/7a45eab6510a78a5d514fae9a5cb6734). The middleware will try to match the request to a route from the spec. This could be used to retrospec an old API, but it is not recommenced for new services.


### Response validation

SRV also offers a middleware for response validation:

```javascript
import {expressResponseValidation} from 'swagger-route-validator';
import express from 'express';

const app = express();

app.get('/foo', expressResponseValidation(/* An object with your route's spec */), (req, res, next) => {
  res.send('Hello World!');
});

```

As well as a direct validation function:

```javascript
import {validateResponse} from 'swagger-route-validator';

const errors = validateResponse(routeSpec, response, );
if (errors.length > 0) throw new Error(`Response object does not match the specification for this route: ${errors.toString()}`);

```

## Running tests

```
npm run test
```

## Running benchmarks

```
npm run bench
```

## Migration from 2.X to 3.X

SRV no longer has a default export, your import statement will need to change from:

`import validate from 'swagger-route-validator';`

To:

`import {validateRequest} from 'swagger-route-validator';`

SRV will now also throw errors when meeting a malformed spec Object.

## License

[Apache 2.0](./LICENSE) - Frederic Charette

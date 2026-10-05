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

app.get('/foo', expressRequestValidation(/* An object of the route's spec */, /* The full spec */), (req, res, next) => {
  res.send('Hello World!');
});

```

You may also run validations directly:

```javascript
import {validateRequest} from 'swagger-route-validator';

const errors = validateRequest(/* An object of the route's spec */, req, /* The full spec */);
if (errors.length > 0) throw new Error(`Request object does not match the specification for this route: ${JSON.stringify(errors)}`);

```



### Response validation

SRV also offers a method to validate response objects:

```javascript
import {validateResponse} from 'swagger-route-validator';

const errors = validateResponse(/* An object of the route's spec */, body, res, /* The full spec */);
if (errors.length > 0) throw new Error(`Response object does not match the specification for this route: ${JSON.stringify(errors)}`);

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

SRV will now also throw errors when meet with a malformed spec Object.

## License

[Apache 2.0](./LICENSE) - Frederic Charette

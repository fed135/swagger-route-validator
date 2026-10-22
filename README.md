<h1 align="center">
  <a title="Swagger Route Validator" href="https://github.com/fed135/swagger-route-validator">
    <img alt="logo" width="300px" src="./srv.png" />
    <br/>
  </a>
  Swagger Route Validator
</h1>
<br/>

---

- The fastest and tiniest request/response validator for OpenAPI applications
- Zero dependencies :star:
- Rigorously tested, no Codegen or evals
- Full OpenAPI 3.x.x feature coverage and OpenAPI [format registry](https://spec.openapis.org/registry/format/)
- Ships an Express 4.x and 5.x compatible middleware
- Define OpenAPI specs as Objects. Say goodbye to YAML files!

---

## Usage

### Request validation

SRV offers a built-in express middleware for easy integration:

```javascript
import {expressRequestValidation} from 'swagger-route-validator';
import express from 'express';

const app = express();

app.get('/foo', expressRequestValidation({ /* An object of the route's spec */ }, { /* The full spec */ }), (req, res, next) => {
  res.send('Hello World!');
});

```

You may also run validations directly:

```javascript
import {validateRequest} from 'swagger-route-validator';

const errors = validateRequest({ /* An object of the route's spec */ }, req, { /* The full spec */ });
if (errors.length > 0) throw new Error(`Request object does not match the specification for this route: ${JSON.stringify(errors)}`);

```


### Response validation

SRV also offers a method to validate response objects:

```javascript
import {validateResponse} from 'swagger-route-validator';

const errors = validateResponse({ /* An object of the route's spec */ }, body, res, { /* The full spec */ });
if (errors.length > 0) throw new Error(`Response object does not match the specification for this route: ${JSON.stringify(errors)}`);

```


### Plain object validation

SRV can also `validate` on any given object:

```javascript
import {validate} from 'swagger-route-validator';

const errors = validate({ type: 'integer' }, 123);
if (errors.length > 0) throw new Error(`Object does not match the specification: ${JSON.stringify(errors)}`);
```

## Supported feature set

| Version | OpenAPI versions | Notes |
| ------- | ---------------- | ----- | 
| 5.x | ^3.0.0, ^3.1.0, ^3.2.0 | Does not support `style` and `explode` options, only supports `application/json` Content-Type parsing and objects. |
| <= 4.x | ^2.0.0, ^3.0.0* | Partial support of official specs. Usage not recommended. |


## Running tests

```
npm run test
```

## Running benchmarks

To perform performance regression testing:

```
npm run perf
```

To benchmark against similar libraries in a realistic scenario:

```
npm run bench
```


## License

[Apache 2.0](./LICENSE) - Frederic Charette

<h1 align="center">
  <a title="Swagger Route Validator" href="http://kalm.js.org">
    <img alt="logo" width="300px" src="./srv.png" />
    <br/>
  </a>
  Swagger Route Validator
</h1>
<br/>

---

- Extremely fast and >10x more efficient than [sway](https://www.npmjs.com/package/sway), the next fastest alternative
- Zero dependencies :star:
- Battle-tested by Fortune 500 companies
- Supports most OpenAPI 3.0 features like $ref, $not, $anyOf, $allOf, $oneOf, etc.
- Supports most common data formats like emails, ips, uuids, dates, etc.

---

## Usage

This is an example of an express middleware, which you could easily implement if you have your routes' swagger definitions.

```javascript
import validate from 'swagger-route-validator';

// Pass in the swagger spec for that route and return an express middleware
export default (routeSpec) => function validateRequest(req, res, next) {
    // Check validation errors
    const errors = validate(routeSpec, req);
    if (errors.length > 0) return res.status(400).json(errors);

    next();
};
```

If you don't know in advance what route definition to use on an inbound request, you can follow [this example](https://gist.github.com/fed135/7a45eab6510a78a5d514fae9a5cb6734)

## Running tests

```
npm run test
```

## License

[Apache 2.0](./LICENSE) - Frederic Charette

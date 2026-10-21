# Changelog

## [v5.0.0] -

commit [#](https://github.com/fed135/swagger-route-validator/commits)

### Changelog

- Added a new `coerce` option to `validate`, `validateRequest` and `expressRequestValidation` (Default: true), which disables modifiying tested objects' values through type coercion. 
- Cleanup in `types.d.ts`
- Added missing support for OAS features
  - 'cookie' location
  - Added support for the full list of OAS [formats](https://spec.openapis.org/registry/format/)
  - 'discriminator' objects
  - 'deprecated' operation flag
  - Added tests for multiple formats: binary, bytes, password
- Added support for OAS 3.2 features
  - HTTP 'QUERY' verb
- TS Docs clearly list supported OAS features 

### Breaking changes

- Removed support for `required: boolean` on Schema parts (except Parameters). As per the official OAS spec. This may cause previously passing validations to now fail!
- Removed support for arbitrary or unsupported Parameter locations, such as `headers`. This may cause previously passing validations to now fail!
- Removed support for legacy Swagger and pre 3.x OAS specifications. `in: 'body'` location will now throw an error. Fixed typings for `requestBody` content types
- `validateRequest` and `expressRequestValidation` no longer accept PathDefinitions. HTTP Verb must be resolved so a RouteDefinition spec if provided.
- Removed non-compliant `list` Schema type
- Renamed non-compliant `enumeration` atom to the official `enum`.
- Parameters now require schema properties in the official `schema` property.
- Removed non-compliant `require: boolean` on Schema parts
- Removed non-compliant `parameters` object at the PathDefinition layer.

## [v4.0.0] - 2026-10-06

commit [#](https://github.com/fed135/swagger-route-validator/commits)

### Changelog

- package.json now has the needed "module" type.
- Memoize $ref resolutions.
- Modernized toolchain (undici -> fetch, jest -> node:test, linter configs).
- Fixed setDefault running deep insertion on every primitive (big perf improvement)
- Added a new export for a plain schema object validation (not limited to http request or response)

### Breaking changes

- Error messages for missing required values now do not repeat cursor location in the message.
- Fixed a bug where path-level values were not coersed.
- Deprecated responseValidation middleware (dual-writes to headers, too hacky. recommended approach is to run validation inside your handler).
- Using node built-in validators for ivp4, ipv6 and URI (Some values may no longer validate)


(Consider storing cursor as an array)

## [v3.1.0] - 2025-06-10

commit [7caeb1e](https://github.com/fed135/swagger-route-validator/commit/7caeb1ee1a8941f7267226a16d0dd1f990b60aeb)

### Changelog

- Fixed Error prototype in express middleware
- Updated express middleware Types

### New features

- Response ranges (ex: 2XX)
- $ref now accepts any local or remote paths

## [v3.0.1] - 2025-05-15

commit [5f95e1d](https://github.com/fed135/swagger-route-validator/commit/5f95e1dc6de520d6217d78f2f7831572d429fd0a)

### Changelog

- Added exports for Specification type interfaces

## [v3.0.0] - 2025-05-15

commit [b735941](https://github.com/fed135/swagger-route-validator/commit/b735941b3f5e806ee21aab673a9d54c55ea2434f)

### Changelog

- Migrated code files to Typescript
- Updated toolchain
- Updated examples
- Added support for multi-level route parameters and the 'requestBody' property
- Added support for webhook syntax and validation
- Added support for whole spec inclusions and path OR method-level objects being passed

### New features

- Response validation
- Express middlewares (request / response)

### Breaking changes

- Package no longer has a default export

## [v2.0.0] - 2022-05-19

commit [67b0400](https://github.com/fed135/swagger-route-validator/commit/67b0400325da8a780e7cde26211036ccc5827dcd)

### New features

- Adds support for:
  - minLength
  - maxLength
  - minProperties
  - maxProperties
  - multipleOf
  - nullable
  - additionalProperties
  - exclusiveMinimum
  - exclusiveMaximum
  - $not
  - $allOf
  - $oneOf
  - $anyOf
  - $ref
- Adds new format validation rules:
  - uuid
  - uri
  - ipv4
  - ipv6
  - email
  - date
  - double
  - float
- Adds type definition for TS users
- Adds Github action pipeline to run tests + linter
- Adds support for the standard `in:header` property while keeping `in:headers` for legacy compatibility

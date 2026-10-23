import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'anyOf';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 2.5, { [testValue]: { type: 'number', minimum: 2 }, type: 'number' }, setDefault, { errors: [] }).length, 0);
  assert.strictEqual(values('', 2, { [testValue]: [{ type: 'number', minimum: 2 }, { type: 'number', minimum: 3 }], type: 'integer' }, setDefault, { errors: [] }).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.deepStrictEqual(values('', 3, { [testValue]: { type: 'number', minimum: 5 }, type: 'number' }, setDefault, { errors: [] }), [{ cursor: '', error: 'Value does not match anyOf statement' }]);
  assert.deepStrictEqual(values('', 3.5, { [testValue]: [{ type: 'string' }], type: 'number' }, setDefault, { errors: [] }), [{ cursor: '', error: 'Value does not match anyOf statement' }]);
});

test(`Can determine the proper model from discriminator property`, () => {
  const spec = {
    components: {
      dog: { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'number', minimum: 2 } } },
      cat: { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'number', minimum: 3 } } },
    },
  };
  assert.strictEqual(values('', { foo: 'dog', bar: 2 }, { [testValue]: [{ $ref: '#/components/dog' }, { $ref: '#/components/cat' }], discriminator: { propertyName: 'foo', mapping: { dog: '#/components/dog', cat: '#/components/cat' } } }, setDefault, { errors: [], fullSpec: spec, coerce: true }).length, 0);
});

test(`Can detect bad model from discriminator property`, () => {
  const spec = {
    components: {
      dog: { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'number', minimum: 2 } } },
      cat: { type: 'object', properties: { foo: { type: 'string' }, bar: { type: 'number', minimum: 3 } } },
    },
  };
  assert.deepStrictEqual(values('', { foo: 'cat', bar: 2 }, { [testValue]: [{ $ref: '#/components/dog' }, { $ref: '#/components/cat' }], discriminator: { propertyName: 'foo', mapping: { dog: '#/components/dog', cat: '#/components/cat' } } }, setDefault, { errors: [], fullSpec: spec, coerce: true }), [{ cursor: '', error: 'Value does not match anyOf statement with discriminator foo' }]);
});

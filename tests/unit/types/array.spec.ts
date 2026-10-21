import { test } from 'node:test';
import { expect } from '../utils.ts';
import assert from 'node:assert/strict';
import { type } from '../../../src/valueValidator.ts';
import { accumulator } from '../../../src/error.ts';

const testType = 'array';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
  const spec = { items: { type: 'integer' } };
  type('', [1, 2, 3], testType, spec, setDefault, {}, expect(true));
});

test(`Can detect valid ${testType} typing with minItems`, () => {
  const spec = { items: { type: 'integer' }, minItems: 4 };
  type('', [1, 2, 3, 4, 5], testType, spec, setDefault, {}, expect(true));
});

test(`Can detect valid ${testType} typing with maxItems`, () => {
  const spec = { items: { type: 'integer' }, maxItems: 2 };
  type('', [1, 2], testType, spec, setDefault, {}, expect(true));
});

test(`Can detect valid ${testType} typing with minItems & maxItems`, () => {
  const spec = { items: { type: 'integer' }, minItems: 4, maxItems: 5 };
  type('', [1, 2, 3, 4], testType, spec, setDefault, {}, expect(true));
});

test(`Can detect valid ${testType} typing with nested objects`, () => {
  const spec = { items: { type: 'object', properties: { foo: { type: 'integer' } } } };
  type('', [{ foo: 123 }, { foo: 456 }], testType, spec, setDefault, {}, expect(true));
});

test(`Can detect valid explodable string ${testType} typing with no params`, () => {
  const spec = { items: { type: 'string' } };
  type('', 'a,b,c', testType, spec, setDefault, {}, expect(true));
});

test(`Can detect invalid ${testType} typings`, () => {
  const spec = { items: { type: 'integer' } };
  type('', true, testType, spec, setDefault, {}, expect(false));
  type('', 1, testType, spec, setDefault, {}, expect(false));
  type('', 0.5, testType, spec, setDefault, {}, expect(false));
  type('', { foo: 'bar' }, testType, spec, setDefault, {}, expect(false));
});

test(`Can detect invalid ${testType} item type validation`, () => {
  const context = { errors: [] };
  const spec = { items: { type: 'integer' } };
  type('', ['a'], testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '[0]', error: 'Value is not an integer' }]);
});

test(`Can detect invalid ${testType} validation of minItems`, () => {
  const context = { errors: [] };
  const spec = { items: { type: 'integer' }, minItems: 4 };
  type('', [1, 2], testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '', error: 'Value does not meet the minimum number of items 4' }]);
});

test(`Can detect invalid ${testType} validation of maxItems`, () => {
  const context = { errors: [] };
  const spec = { items: { type: 'integer' }, maxItems: 3 };
  type('', [1, 2, 3, 4], testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '', error: 'Value exceeds the maximum number of items 3' }]);
});

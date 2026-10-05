import { test } from 'node:test';
import assert from 'node:assert/strict';
import { type } from '../../../src/valueValidator.ts';

const testType = 'array';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
  const spec = { items: { type: 'integer' } };
  assert.strictEqual(type('', [1, 2, 3], testType, spec, setDefault, []).length, 0);
});

test(`Can detect valid ${testType} typing with minItems`, () => {
  const spec = { items: { type: 'integer' }, minItems: 4 };
  assert.strictEqual(type('', [1, 2, 3, 4, 5], testType, spec, setDefault, []).length, 0);
});

test(`Can detect valid ${testType} typing with maxItems`, () => {
  const spec = { items: { type: 'integer' }, maxItems: 2 };
  assert.strictEqual(type('', [1, 2], testType, spec, setDefault, []).length, 0);
});

test(`Can detect valid ${testType} typing with minItems & maxItems`, () => {
  const spec = { items: { type: 'integer' }, minItems: 4, maxItems: 5 };
  assert.strictEqual(type('', [1, 2, 3, 4], testType, spec, setDefault, []).length, 0);
});

test(`Can detect valid ${testType} typing with nested objects`, () => {
  const spec = { items: { type: 'object', properties: { foo: { type: 'integer' } } } };
  assert.strictEqual(type('', [{ foo: 123 }, { foo: 456 }], testType, spec, setDefault, []).length, 0);
});

test(`Can detect invalid ${testType} typings`, () => {
  const spec = { items: { type: 'integer' } };
  assert.strictEqual(type('', true, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', 1, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', 'a', testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', 0.5, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', { foo: 'bar' }, testType, spec, setDefault, []).length, 1);
});

test(`Can detect invalid ${testType} item type validation`, () => {
  const spec = { items: { type: 'integer' } };
  assert.strictEqual(type('', ['a'], testType, spec, setDefault, []).length, 1);
});

test(`Can detect invalid ${testType} validation of minItems`, () => {
  const spec = { items: { type: 'integer' }, minItems: 4 };
  assert.strictEqual(type('', [1, 2], testType, spec, setDefault, []).length, 1);
});

test(`Can detect invalid ${testType} validation of maxItems`, () => {
  const spec = { items: { type: 'integer' }, maxItems: 3 };
  assert.strictEqual(type('', [1, 2, 3, 4], testType, spec, setDefault, []).length, 1);
});

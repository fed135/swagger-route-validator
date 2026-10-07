import { test } from 'node:test';
import assert from 'node:assert/strict';
import { type } from '../../../src/valueValidator.ts';

const testType = 'object';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'integer' } } };
  assert.strictEqual(type('', { foo: 123 }, testType, spec, setDefault, []).length, 0);
});

test(`Can detect invalid ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'integer' } } };
  assert.strictEqual(type('', { foo: 'abc' }, testType, spec, setDefault, []).length, 1);
});

test(`Can detect valid nested ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
  assert.strictEqual(type('', { foo: { bar: 123 } }, testType, spec, setDefault, []).length, 0);
});

test(`Can detect invalid nested ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
  assert.strictEqual(type('', { foo: { bar: 'abc' } }, testType, spec, setDefault, []).length, 1);
});

test(`Can detect valid ${testType} typing with required properties`, () => {
  const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
  assert.strictEqual(type('', { foo: 123 }, testType, spec, setDefault, []).length, 0);
});

test(`Can detect invalid ${testType} typing with required properties`, () => {
  const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
  assert.strictEqual(type('', { bar: 123 }, testType, spec, setDefault, []).length, 1);
});

test(`Can detect invalid ${testType} typing with extra properties`, () => {
  const spec = { properties: { foo: { type: 'integer' } }, additionalProperties: false };
  assert.strictEqual(type('', { bar: 123, foo: 456 }, testType, spec, setDefault, []).length, 1);
});

test(`Can detect invalid ${testType} typings`, () => {
  const spec = { properties: { foo: { type: 'integer' } } };
  assert.strictEqual(type('', -1, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', 0.5, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', true, testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', 'a', testType, spec, setDefault, []).length, 1);
  assert.strictEqual(type('', [1, 2, 3], testType, spec, setDefault, []).length, 1);
});

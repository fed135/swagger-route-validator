import { test } from 'node:test';
import { expect } from '../utils.ts';
import assert from 'node:assert/strict';
import { type } from '../../../src/valueValidator.ts';
import { accumulator } from '../../../src/error.ts';

const testType = 'object';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'integer' } } };
  type('', { foo: 123 }, testType, spec, setDefault, {}, expect(true));
});

test(`Can detect invalid ${testType} typing with no params`, () => {
  const context = { errors: [] };
  const spec = { properties: { foo: { type: 'integer' } } };
  type('', { foo: 'abc' }, testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '.foo', error: 'Value is not an integer' }]);
});

test(`Can detect valid nested ${testType} typing with no params`, () => {
  const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
  type('', { foo: { bar: 123 } }, testType, spec, setDefault, {}, expect(true));
});

test(`Can detect invalid nested ${testType} typing with no params`, () => {
  const context = { errors: [] };
  const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
  type('', { foo: { bar: 'abc' } }, testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '.foo.bar', error: 'Value is not an integer' }]);
});

test(`Can detect valid ${testType} typing with required properties`, () => {
  const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
  type('', { foo: 123 }, testType, spec, setDefault, {}, expect(true));
});

test(`Can detect invalid ${testType} typing with required properties`, () => {
  const context = { errors: [] };
  const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
  type('', { bar: 123 }, testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '', error: 'Value is missing required keys [foo]' }]);
});

test(`Can detect invalid ${testType} typing with extra properties`, () => {
  const context = { errors: [] };
  const spec = { properties: { foo: { type: 'integer' } }, additionalProperties: false };
  type('', { bar: 123, foo: 456 }, testType, spec, setDefault, context, accumulator('', context.errors));
  assert.deepStrictEqual(context.errors, [{ cursor: '', error: 'Unexpected key bar in object, additionalProperties not permitted' }]);
});

test(`Can detect invalid ${testType} typings`, () => {
  const spec = { properties: { foo: { type: 'integer' } } };
  type('', -1, testType, spec, setDefault, {}, expect(false));
  type('', 0.5, testType, spec, setDefault, {}, expect(false));
  type('', true, testType, spec, setDefault, {}, expect(false));
  type('', 'a', testType, spec, setDefault, {}, expect(false));
  type('', [1, 2, 3], testType, spec, setDefault, {}, expect(false));
});

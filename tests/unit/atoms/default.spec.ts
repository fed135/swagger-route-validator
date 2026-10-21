import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue } from '../../../src/valueValidator.ts';

const testValue = 'default';

test(`Can apply ${testValue} values`, () => {
  const obj: any = {};
  assert.strictEqual(validateValue('foo', obj.foo, { [testValue]: 'a', type: 'string' }, v => obj.foo = v, { errors: [] }).length, 0);
  assert.strictEqual(obj.foo, 'a');
});

test(`Can apply nested ${testValue} values`, () => {
  const obj: any = { bar: {} };
  assert.strictEqual(validateValue('bar.foo', obj.bar.foo, { [testValue]: 'a', type: 'string' }, v => obj.bar.foo = v, { errors: [] }).length, 0);
  assert.strictEqual(obj.bar.foo, 'a');
});

test('Can check against coerced values for integers - does not modify validated object', () => {
  const obj = { bar: '1' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: 2, type: 'integer' }, v => obj.bar = v, { errors: [] }).length, 0);
  assert.strictEqual(obj.bar, '1');
});

test('Can check against coerced values for booleans - does not modify validated object', () => {
  const obj = { bar: 'false' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: true, type: 'boolean' }, v => obj.bar = v, { errors: [] }).length, 0);
  assert.strictEqual(obj.bar, 'false');
});

test('Can modify validated object with coerced value for integers', () => {
  const obj = { bar: '1' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: 2, type: 'integer' }, v => obj.bar = v, { errors: [], coerce: true }).length, 0);
  assert.strictEqual(obj.bar, 1);
});

test('Can modify validated object with coerced value for booleans', () => {
  const obj = { bar: 'false' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: true, type: 'boolean' }, v => obj.bar = v, { errors: [], coerce: true }).length, 0);
  assert.strictEqual(obj.bar, false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue, set } from '../../../src/valueValidator.ts';

const testValue = 'default';

test(`Can apply ${testValue} values`, () => {
  const obj:any = {};
  assert.strictEqual(validateValue('foo', obj.foo, { [testValue]: 'a', type: 'string' }, set(obj), []).length, 0);
  assert.strictEqual(obj.foo, 'a');
});

test(`Can apply nested ${testValue} values`, () => {
  const obj:any = { bar: {} };
  assert.strictEqual(validateValue('bar.foo', obj.bar.foo, { [testValue]: 'a', type: 'string' }, set(obj), []).length, 0);
  assert.strictEqual(obj.bar.foo, 'a');
});

test('Can passively apply typed values for integers', () => {
  const obj = { bar: '1' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: 2, type: 'integer' }, set(obj), []).length, 0);
  assert.strictEqual(obj.bar, 1);
});

test('Can passively apply typed values for numbers', () => {
  const obj = { bar: '.5' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: 1, type: 'number' }, set(obj), []).length, 0);
  assert.strictEqual(obj.bar, 0.5);
});

test('Can passively apply typed values for booleans', () => {
  const obj = { bar: 'false' };
  assert.strictEqual(validateValue('bar', obj.bar, { [testValue]: true, type: 'boolean' }, set(obj), []).length, 0);
  assert.strictEqual(obj.bar, false);
});

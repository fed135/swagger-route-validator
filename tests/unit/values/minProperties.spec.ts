import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'minProperties';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', { foo: 1 }, { [testValue]: 1, type: 'object' }, setDefault, []).length, 0);
  assert.strictEqual(values('', { foo: 1, bar: 2, baz: 3 }, { [testValue]: 1, type: 'object' }, setDefault, []).length, 0);
  assert.strictEqual(values('', {}, { [testValue]: 0, type: 'object' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', {}, { [testValue]: 1, type: 'object' }, setDefault, []).length, 1);
});

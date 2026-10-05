import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'multipleOf';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 9, { [testValue]: 3, type: 'number' }, setDefault, []).length, 0);
  assert.strictEqual(values('', 100, { [testValue]: 10, type: 'integer' }, setDefault, []).length, 0);
  assert.strictEqual(values('', 3, { [testValue]: 3, type: 'number' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', 3.5, { [testValue]: 3, type: 'number' }, setDefault, []).length, 1);
  assert.strictEqual(values('', 4, { [testValue]: 3, type: 'integer' }, setDefault, []).length, 1);
});

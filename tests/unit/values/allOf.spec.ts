import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = '$allOf';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 2.5, { [testValue]: { type: 'number', minimum: 2 }, type: 'number' }, setDefault, []).length, 0);
  assert.strictEqual(values('', 2, { [testValue]: [{ type: 'number', minimum: 2 }, { type: 'number', maximum: 3 }], type: 'integer' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', 3, { [testValue]: { type: 'number', minimum: 5 }, type: 'number' }, setDefault, []).length, 1);
  assert.strictEqual(values('', 3.5, { [testValue]: [{ type: 'string' }], type: 'number' }, setDefault, []).length, 1);
});

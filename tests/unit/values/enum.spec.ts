import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'enum';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 'a', { [testValue]: ['a', 'b', 'c'], type: 'string' }, setDefault, []).length, 0);
  assert.strictEqual(values('', 0, { [testValue]: [0, 1, 2], type: 'integer' }, setDefault, []).length, 0);
  assert.strictEqual(values('', true, { [testValue]: [true], type: 'boolean' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', 'd', { [testValue]: ['a', 'b', 'c'], type: 'string' }, setDefault, []).length, 1);
  assert.strictEqual(values('', -1, { [testValue]: [0, 1, 2], type: 'integer' }, setDefault, []).length, 1);
  assert.strictEqual(values('', false, { [testValue]: [true], type: 'boolean' }, setDefault, []).length, 1);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'pattern';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 'abc', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, []).length, 0);
  assert.strictEqual(values('', '123', { [testValue]: '[0-9]', type: 'string' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', '123', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, []).length, 1);
  assert.strictEqual(values('', 'abc', { [testValue]: '[0-9]', type: 'string' }, setDefault, []).length, 1);
});

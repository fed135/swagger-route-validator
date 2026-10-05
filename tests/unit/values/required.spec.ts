import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'required';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 'abc', { [testValue]: true, type: 'string' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', undefined, { [testValue]: true, type: 'string' }, setDefault, []).length, 1);
});

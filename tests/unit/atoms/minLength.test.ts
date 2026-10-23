import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'minLength';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 'abc', { [testValue]: '1', type: 'string' }, setDefault, { errors: [] }).length, 0);
  assert.strictEqual(values('', '123', { [testValue]: '3', type: 'string' }, setDefault, { errors: [] }).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.deepStrictEqual(values('', '123', { [testValue]: '5', type: 'string' }, setDefault, { errors: [] }), [{ cursor: '', error: 'Value has does not match minimum length: 5' }]);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'pattern';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', 'abc', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, { errors: [] }).length, 0);
  assert.strictEqual(values('', '123', { [testValue]: '[0-9]', type: 'string' }, setDefault, { errors: [] }).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.deepStrictEqual(values('', '123', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, { errors: [] }), [{ cursor: '', error: 'Value does not match pattern [a-zA-Z]' }]);
  assert.deepStrictEqual(values('', 'abc', { [testValue]: '[0-9]', type: 'string' }, setDefault, { errors: [] }), [{ cursor: '', error: 'Value does not match pattern [0-9]' }]);
});

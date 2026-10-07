import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'nullable';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', undefined, { [testValue]: true, type: 'string' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', 'abc', { [testValue]: true, type: 'string' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values mixed with default`, () => {
  assert.strictEqual(values('', undefined, { [testValue]: true, type: 'string', default: 'a' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values mixed with required`, () => {
  assert.strictEqual(values('', undefined, { [testValue]: true, type: 'string', required: true }, setDefault, []).length, 1);
});

test(`Can detect invalid ${testValue} values mixed with required and default`, () => {
  assert.strictEqual(values('', undefined, { [testValue]: true, type: 'string', required: true, default: 'a' }, setDefault, []).length, 1);
});

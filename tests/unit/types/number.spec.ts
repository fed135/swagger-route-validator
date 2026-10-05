import { test } from 'node:test';
import assert from 'node:assert/strict';
import { type } from '../../../src/valueValidator.ts';

const testType = 'number';
const setDefault = () => {};
const specs = {};

test(`Can detect valid ${testType} typing`, () => {
  assert.strictEqual(type('', 1, testType, specs, setDefault, []).length, 0);
  assert.strictEqual(type('', 0, testType, specs, setDefault, []).length, 0);
  assert.strictEqual(type('', -1, testType, specs, setDefault, []).length, 0);
  assert.strictEqual(type('', 0.5, testType, specs, setDefault, []).length, 0);
  assert.strictEqual(type('', '0.5', testType, specs, setDefault, []).length, 0);
});

test(`Can detect invalid ${testType} typings`, () => {
  assert.strictEqual(type('', 'a', testType, specs, setDefault, []).length, 1);
  assert.strictEqual(type('', { foo: 'bar' }, testType, specs, setDefault, []).length, 1);
  assert.strictEqual(type('', [1, 2, 3], testType, specs, setDefault, []).length, 1);
});

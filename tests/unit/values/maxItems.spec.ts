import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateValue as values } from '../../../src/valueValidator.ts';

const setDefault = () => {};
const testValue = 'maxItems';

test(`Can detect valid ${testValue} values`, () => {
  assert.strictEqual(values('', ['foo'], { [testValue]: 1, type: 'array' }, setDefault, []).length, 0);
  assert.strictEqual(values('', ['foo', 'bar', 'baz'], { [testValue]: 3, type: 'array' }, setDefault, []).length, 0);
  assert.strictEqual(values('', [], { [testValue]: 3, type: 'array' }, setDefault, []).length, 0);
});

test(`Can detect invalid ${testValue} values`, () => {
  assert.strictEqual(values('', ['foo', 'bar', 'baz'], { [testValue]: 1, type: 'array' }, setDefault, []).length, 1);
});

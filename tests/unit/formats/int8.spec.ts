import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '../../../src/format.ts';

const testFormat = 'int8';

test(`Can detect valid ${testFormat} format number`, () => {
  assert.strictEqual(format('', 1, testFormat, []).length, 0);
  assert.strictEqual(format('', 0, testFormat, []).length, 0);
  assert.strictEqual(format('', -1, testFormat, []).length, 0);
  assert.strictEqual(format('', -128, testFormat, []).length, 0);
  assert.strictEqual(format('', 127, testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '1', testFormat, []).length, 1);
  assert.strictEqual(format('', 'a', testFormat, []).length, 1);
  assert.strictEqual(format('', 0.5, testFormat, []).length, 1);
  assert.strictEqual(format('', -129, testFormat, []).length, 1);
  assert.strictEqual(format('', 128, testFormat, []).length, 1);
});

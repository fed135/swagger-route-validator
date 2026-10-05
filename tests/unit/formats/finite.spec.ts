import { test } from 'node:test';
import assert from 'node:assert/strict';
import {format} from '../../../src/format.ts';

const testFormat = 'double';

test(`Can detect valid ${testFormat} format number`, () => {
  assert.strictEqual(format('', 1, testFormat, []).length, 0);
  assert.strictEqual(format('', 0, testFormat, []).length, 0);
  assert.strictEqual(format('', -1, testFormat, []).length, 0);
  assert.strictEqual(format('', 0.5, testFormat, []).length, 0);
  assert.strictEqual(format('', -0.5, testFormat, []).length, 0);
  assert.strictEqual(format('', -9223372036854776001, testFormat, []).length, 0);
  assert.strictEqual(format('', 9223372036854776000, testFormat, []).length, 0);
  assert.strictEqual(format('', -9223372036854776002, testFormat, []).length, 0); // Gets rounded to MAX_SAFE_INTEGER
  assert.strictEqual(format('', 9223372036854776001, testFormat, []).length, 0); // Gets rounded to MAX_SAFE_INTEGER
  assert.strictEqual(format('', Math.PI, testFormat, []).length, 0); // JS spec makes this value a constant with 10 decimals, so technically Finite
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '1', testFormat, []).length, 1);
  assert.strictEqual(format('', 'a', testFormat, []).length, 1);
  assert.strictEqual(format('', NaN, testFormat, []).length, 1);
  assert.strictEqual(format('', Infinity, testFormat, []).length, 1);
});

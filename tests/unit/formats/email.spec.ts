import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '../../../src/format.ts';

const testFormat = 'email';

test(`Can detect valid ${testFormat} formats`, () => {
  assert.strictEqual(format('', 'me@mail.com', testFormat, []).length, 0);
  assert.strictEqual(format('', 'me+spam@mail.com', testFormat, []).length, 0);
  assert.strictEqual(format('', 'me@mailcom', testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', 'me@mail..com', testFormat, []).length, 1);
  assert.strictEqual(format('', 'mail.com', testFormat, []).length, 1);
  assert.strictEqual(format('', 'me @ mail . com', testFormat, []).length, 1);
  assert.strictEqual(format('', 1557756500211, testFormat, []).length, 1);
});

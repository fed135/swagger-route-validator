import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '../../../src/format.ts';

const testFormat = 'ipv6';

test(`Can detect valid ${testFormat} format number`, () => {
  assert.strictEqual(format('', '1:2:3:4:5:6:7:8', testFormat, []).length, 0);
  assert.strictEqual(format('', '1::', testFormat, []).length, 0);
  assert.strictEqual(format('', '1::8', testFormat, []).length, 0);
  assert.strictEqual(format('', '2001:db8:3:4::192.0.2.33', testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '1', testFormat, []).length, 1);
  assert.strictEqual(format('', 255, testFormat, []).length, 1);
  assert.strictEqual(format('', '192.168.0.1', testFormat, []).length, 1);
});

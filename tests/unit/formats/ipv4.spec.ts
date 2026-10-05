import { test } from 'node:test';
import assert from 'node:assert/strict';
import {format} from '../../../src/format.ts';

const testFormat = 'ipv4';

test(`Can detect valid ${testFormat} format number`, () => {
  assert.strictEqual(format('', '192.168.0.1', testFormat, []).length, 0);
  assert.strictEqual(format('', '0.0.0.0', testFormat, []).length, 0);
  assert.strictEqual(format('', '255.255.255.255', testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '1', testFormat, []).length, 1);
  assert.strictEqual(format('', 255, testFormat, []).length, 1);
  assert.strictEqual(format('', '192.168.0.1:1', testFormat, []).length, 1);
  assert.strictEqual(format('', '192.168.0.1.1', testFormat, []).length, 1);
  assert.strictEqual(format('', '192.168.0.-1', testFormat, []).length, 1);
  assert.strictEqual(format('', '0.0.0', testFormat, []).length, 1);
  assert.strictEqual(format('', '256.256.256.256', testFormat, []).length, 1);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '../../../src/format.ts';

const testFormat = 'date-time';

test(`Can detect valid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '2002-10-02T10:00:00-05:00', testFormat, []).length, 0);
  assert.strictEqual(format('', '2002-10-02T15:00:00Z', testFormat, []).length, 0);
  assert.strictEqual(format('', '2002-10-02T15:00:00.05Z', testFormat, []).length, 0);
  assert.strictEqual(format('', (new Date()).toISOString(), testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '2002-13-02T15:00:00Z', testFormat, []).length, 1);
  assert.strictEqual(format('', '2002-10-02 15:00:00', testFormat, []).length, 1);
  assert.strictEqual(format('', '10-02-2002', testFormat, []).length, 1);
  assert.strictEqual(format('', 'January 1st 2002', testFormat, []).length, 1);
  assert.strictEqual(format('', 1557756500211, testFormat, []).length, 1);
});

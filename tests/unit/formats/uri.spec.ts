import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format } from '../../../src/format.ts';

const testFormat = 'uri';

test(`Can detect valid ${testFormat} formats`, () => {
  assert.strictEqual(format('', 'http://mail.com', testFormat, []).length, 0);
  assert.strictEqual(format('', 'ftp://mail.com', testFormat, []).length, 0);
  assert.strictEqual(format('', 'https://mail.com:9001', testFormat, []).length, 0);
  assert.strictEqual(format('', 'http://0.0.0.0', testFormat, []).length, 0);
  assert.strictEqual(format('', 'http://subdomain.site.org', testFormat, []).length, 0);
  assert.strictEqual(format('', 'http://subdomain.site.org/path', testFormat, []).length, 0);
  assert.strictEqual(format('', 'http://subdomain.site.org/path?param=test', testFormat, []).length, 0);
  assert.strictEqual(format('', 'http://mailcom', testFormat, []).length, 0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  assert.strictEqual(format('', '//mail.com', testFormat, []).length, 1);
  assert.strictEqual(format('', 'mailcom', testFormat, []).length, 1);
  assert.strictEqual(format('', 'mail..com', testFormat, []).length, 1);
  assert.strictEqual(format('', 'mail com', testFormat, []).length, 1);
  assert.strictEqual(format('', 'subdomain.site.org\\path?param=test', testFormat, []).length, 1);
  assert.strictEqual(format('', 1557756500211, testFormat, []).length, 1);
});

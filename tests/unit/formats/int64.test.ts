import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatNumber, formatString } from '../../../src/format.ts';

const testFormat = 'int64';

test(`Can detect valid ${testFormat} format for number type`, () => {
  formatNumber(1, testFormat, expect(true));
  formatNumber(0, testFormat, expect(true));
  formatNumber(-1, testFormat, expect(true));
  formatNumber(-9223372036854776001, testFormat, expect(true));
  formatNumber(9223372036854776000, testFormat, expect(true));
  formatNumber(-9223372036854776002, testFormat, expect(true)); // Gets rounded to MAX_SAFE_INTEGER
  formatNumber(9223372036854776001, testFormat, expect(true)); // Gets rounded to MAX_SAFE_INTEGER
});

test(`Can detect invalid ${testFormat} formats for number type`, () => {
  formatNumber('1', testFormat, expect(false));
  formatNumber('a', testFormat, expect(false));
  formatNumber(0.5, testFormat, expect(false));
});

test(`Can detect valid ${testFormat} string formats`, () => {
  formatString('0', testFormat, expect(true));
  formatString('42', testFormat, expect(true));
  formatString('-42', testFormat, expect(true));
  formatString('9223372036854775807', testFormat, expect(true));
  formatString('-9223372036854775808', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} string formats`, () => {
  formatString('', testFormat, expect(false));
  formatString('-0', testFormat, expect(false));
  formatString('007', testFormat, expect(false));
  formatString('+5', testFormat, expect(false));
  formatString('1.5', testFormat, expect(false));
  formatString('1e3', testFormat, expect(false));
  formatString('abc', testFormat, expect(false));
  formatString('9223372036854775808', testFormat, expect(false));
  formatString('-9223372036854775809', testFormat, expect(false));
});

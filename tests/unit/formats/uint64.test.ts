import { test } from 'node:test';
import { formatString, formatNumber } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'uint64';

test(`Can detect valid ${testFormat} string formats`, () => {
  formatString('0', testFormat, expect(true));
  formatString('42', testFormat, expect(true));
  formatString('18446744073709551615', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} string formats`, () => {
  formatString('', testFormat, expect(false));
  formatString('-1', testFormat, expect(false));
  formatString('007', testFormat, expect(false));
  formatString('1.5', testFormat, expect(false));
  formatString('abc', testFormat, expect(false));
  formatString('18446744073709551616', testFormat, expect(false));
});

test(`Can detect valid ${testFormat} number formats`, () => {
  formatNumber(0, testFormat, expect(true));
  formatNumber(42, testFormat, expect(true));
  formatNumber(Number.MAX_SAFE_INTEGER, testFormat, expect(true));
  formatNumber(2 ** 64 - 2048, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} number formats`, () => {
  formatNumber(-1, testFormat, expect(false));
  formatNumber(1.5, testFormat, expect(false));
  formatNumber(2 ** 64, testFormat, expect(false));
  formatNumber(NaN, testFormat, expect(false));
  formatNumber(Infinity, testFormat, expect(false));
});

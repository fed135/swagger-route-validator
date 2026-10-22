import { test } from 'node:test';
import { formatString, formatNumber } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'decimal128';

test(`Can detect valid ${testFormat} string formats`, () => {
  formatString('1.5', testFormat, expect(true));
  formatString('-0.5', testFormat, expect(true));
  formatString('+1.5', testFormat, expect(true));
  formatString('1.5e100', testFormat, expect(true));
  formatString('1234567890123456789012345678901234', testFormat, expect(true));
  formatString('-0.0000000000000000000000000000000001', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} string formats`, () => {
  formatString('', testFormat, expect(false));
  formatString('abc', testFormat, expect(false));
  formatString('1e', testFormat, expect(false));
  formatString('1.2.3', testFormat, expect(false));
  formatString('1,5', testFormat, expect(false));
  formatString('12345678901234567890123456789012345', testFormat, expect(false));
});

test(`Can detect valid ${testFormat} number formats`, () => {
  formatNumber(0, testFormat, expect(true));
  formatNumber(1.5, testFormat, expect(true));
  formatNumber(-1e300, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} number formats`, () => {
  formatNumber(NaN, testFormat, expect(false));
  formatNumber(Infinity, testFormat, expect(false));
  formatNumber(-Infinity, testFormat, expect(false));
});

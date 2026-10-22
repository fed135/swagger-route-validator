import { test } from 'node:test';
import { formatString, formatNumber } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'decimal';

test(`Can detect valid ${testFormat} string formats`, () => {
  formatString('0', testFormat, expect(true));
  formatString('100', testFormat, expect(true));
  formatString('-1.5', testFormat, expect(true));
  formatString('3.14159', testFormat, expect(true));
  formatString('0.0001', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} string formats`, () => {
  formatString('', testFormat, expect(false));
  formatString('1e5', testFormat, expect(false));
  formatString('.5', testFormat, expect(false));
  formatString('1.', testFormat, expect(false));
  formatString('abc', testFormat, expect(false));
  formatString('1,000', testFormat, expect(false));
  formatString('+1', testFormat, expect(false));
});

test(`Can detect valid ${testFormat} number formats`, () => {
  formatNumber(0, testFormat, expect(true));
  formatNumber(1.5, testFormat, expect(true));
  formatNumber(-42, testFormat, expect(true));
  formatNumber(1e21, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} number formats`, () => {
  formatNumber(NaN, testFormat, expect(false));
  formatNumber(Infinity, testFormat, expect(false));
  formatNumber(-Infinity, testFormat, expect(false));
  formatNumber('1.5', testFormat, expect(false));
});

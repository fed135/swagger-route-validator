import { test } from 'node:test';
import { formatString, formatNumber } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'unixtime';

test(`Can detect valid ${testFormat} string formats`, () => {
  formatString('0', testFormat, expect(true));
  formatString('1700000000', testFormat, expect(true));
  formatString('-86400', testFormat, expect(true));
  formatString('1700000000.5', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} string formats`, () => {
  formatString('', testFormat, expect(false));
  formatString('abc', testFormat, expect(false));
  formatString('1e9', testFormat, expect(false));
  formatString('17:00', testFormat, expect(false));
  formatString('--1', testFormat, expect(false));
});

test(`Can detect valid ${testFormat} number formats`, () => {
  formatNumber(0, testFormat, expect(true));
  formatNumber(1700000000, testFormat, expect(true));
  formatNumber(-86400, testFormat, expect(true));
  formatNumber(1700000000.5, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} number formats`, () => {
  formatNumber(NaN, testFormat, expect(false));
  formatNumber(Infinity, testFormat, expect(false));
  formatNumber(-Infinity, testFormat, expect(false));
});

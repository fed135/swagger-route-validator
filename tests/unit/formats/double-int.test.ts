import { test } from 'node:test';
import { formatNumber as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'double-int';

test(`Can detect valid ${testFormat} formats`, () => {
  format(0, testFormat, expect(true));
  format(-1, testFormat, expect(true));
  format(42, testFormat, expect(true));
  format(Number.MAX_SAFE_INTEGER, testFormat, expect(true));
  format(Number.MIN_SAFE_INTEGER, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format(1.5, testFormat, expect(false));
  format(2 ** 53, testFormat, expect(false));
  format(-(2 ** 53), testFormat, expect(false));
  format(NaN, testFormat, expect(false));
  format(Infinity, testFormat, expect(false));
  format('5', testFormat, expect(false));
});

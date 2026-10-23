import { test } from 'node:test';
import { formatNumber as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'uint32';

test(`Can detect valid ${testFormat} formats`, () => {
  format(0, testFormat, expect(true));
  format(1, testFormat, expect(true));
  format(4294967295, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format(-1, testFormat, expect(false));
  format(4294967296, testFormat, expect(false));
  format(1.5, testFormat, expect(false));
  format(NaN, testFormat, expect(false));
  format(Infinity, testFormat, expect(false));
  format('5', testFormat, expect(false));
});

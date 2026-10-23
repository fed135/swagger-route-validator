import { test } from 'node:test';
import { formatNumber as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'uint8';

test(`Can detect valid ${testFormat} formats`, () => {
  format(0, testFormat, expect(true));
  format(1, testFormat, expect(true));
  format(255, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format(-1, testFormat, expect(false));
  format(256, testFormat, expect(false));
  format(1.5, testFormat, expect(false));
  format(NaN, testFormat, expect(false));
  format(Infinity, testFormat, expect(false));
  format('5', testFormat, expect(false));
});

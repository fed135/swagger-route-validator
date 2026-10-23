import { test } from 'node:test';
import { formatNumber as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'sf-integer';

test(`Can detect valid ${testFormat} formats`, () => {
  format(0, testFormat, expect(true));
  format(-1, testFormat, expect(true));
  format(42, testFormat, expect(true));
  format(999999999999999, testFormat, expect(true));
  format(-999999999999999, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format(1.5, testFormat, expect(false));
  format(1e15, testFormat, expect(false));
  format(-1e15, testFormat, expect(false));
  format(NaN, testFormat, expect(false));
  format(Infinity, testFormat, expect(false));
  format('5', testFormat, expect(false));
});

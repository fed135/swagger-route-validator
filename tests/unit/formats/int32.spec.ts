import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatNumber as format } from '../../../src/format.ts';

const testFormat = 'int32';

test(`Can detect valid ${testFormat} format number`, () => {
  format(1, testFormat, expect(true));
  format(0, testFormat, expect(true));
  format(-1, testFormat, expect(true));
  format(-2147483648, testFormat, expect(true));
  format(2147483647, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('1', testFormat, expect(false));
  format('a', testFormat, expect(false));
  format(0.5, testFormat, expect(false));
  format(-2147483649, testFormat, expect(false));
  format(2147483648, testFormat, expect(false));
});

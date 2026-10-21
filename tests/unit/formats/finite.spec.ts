import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatNumber as format } from '../../../src/format.ts';

const testFormat = 'double';

test(`Can detect valid ${testFormat} format number`, () => {
  format(1, testFormat, expect(true));
  format(0, testFormat, expect(true));
  format(-1, testFormat, expect(true));
  format(0.5, testFormat, expect(true));
  format(-0.5, testFormat, expect(true));
  format(-9223372036854776001, testFormat, expect(true));
  format(9223372036854776000, testFormat, expect(true));
  format(-9223372036854776002, testFormat, expect(true)); // Gets rounded to MAX_SAFE_INTEGER
  format(9223372036854776001, testFormat, expect(true)); // Gets rounded to MAX_SAFE_INTEGER
  format(Math.PI, testFormat, expect(true)); // JS spec makes this value a constant with 10 decimals, so technically Finite
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('1', testFormat, expect(false));
  format('a', testFormat, expect(false));
  format(NaN, testFormat, expect(false));
  format(Infinity, testFormat, expect(false));
});

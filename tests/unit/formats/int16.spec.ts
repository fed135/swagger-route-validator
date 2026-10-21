import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatNumber as format } from '../../../src/format.ts';

const testFormat = 'int16';

test(`Can detect valid ${testFormat} format number`, () => {
  format(1, testFormat, expect(true));
  format(0, testFormat, expect(true));
  format(-1, testFormat, expect(true));
  format(-32768, testFormat, expect(true));
  format(32767, testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('1', testFormat, expect(false));
  format('a', testFormat, expect(false));
  format(0.5, testFormat, expect(false));
  format(-32769, testFormat, expect(false));
  format(32768, testFormat, expect(false));
});

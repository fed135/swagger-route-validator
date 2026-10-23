import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'time-local';

test(`Can detect valid ${testFormat} formats`, () => {
  format('15:00:00', testFormat, expect(true));
  format('00:00:00', testFormat, expect(true));
  format('23:59:59.999', testFormat, expect(true));
  format('23:59:60', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('15:00:00Z', testFormat, expect(false));
  format('15:00:00-05:00', testFormat, expect(false));
  format('24:00:00', testFormat, expect(false));
  format('15:00', testFormat, expect(false));
  format('3pm', testFormat, expect(false));
  format('15:60:00', testFormat, expect(false));
  format(150000, testFormat, expect(false));
});

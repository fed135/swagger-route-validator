import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'time';

test(`Can detect valid ${testFormat} formats`, () => {
  format('15:00:00Z', testFormat, expect(true));
  format('10:00:00-05:00', testFormat, expect(true));
  format('23:59:60Z', testFormat, expect(true));
  format('15:00:00.05+01:30', testFormat, expect(true));
  format('15:00:00z', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('15:00:00', testFormat, expect(false));
  format('24:00:00Z', testFormat, expect(false));
  format('15:00Z', testFormat, expect(false));
  format('15:00:00+25:00', testFormat, expect(false));
  format('noon', testFormat, expect(false));
  format('', testFormat, expect(false));
  format(150000, testFormat, expect(false));
});

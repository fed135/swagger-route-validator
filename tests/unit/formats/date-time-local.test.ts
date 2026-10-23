import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'date-time-local';

test(`Can detect valid ${testFormat} formats`, () => {
  format('2002-10-02T15:00:00', testFormat, expect(true));
  format('2002-10-02T15:00:00.05', testFormat, expect(true));
  format('2002-10-02t15:00:00', testFormat, expect(true));
  format('2002-12-31T23:59:60', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('2002-10-02T15:00:00Z', testFormat, expect(false));
  format('2002-10-02T15:00:00-05:00', testFormat, expect(false));
  format('2002-13-02T15:00:00', testFormat, expect(false));
  format('2002-10-02 15:00:00', testFormat, expect(false));
  format('2002-10-02T25:00:00', testFormat, expect(false));
  format('10-02-2002', testFormat, expect(false));
  format('January 1st 2002', testFormat, expect(false));
  format(1557756500211, testFormat, expect(false));
});

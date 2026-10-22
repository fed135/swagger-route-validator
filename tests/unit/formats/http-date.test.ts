import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'http-date';

test(`Can detect valid ${testFormat} formats`, () => {
  format('Sun, 06 Nov 1994 08:49:37 GMT', testFormat, expect(true));
  format('Sunday, 06-Nov-94 08:49:37 GMT', testFormat, expect(true));
  format('Sun Nov  6 08:49:37 1994', testFormat, expect(true));
  format('Sun Nov 16 08:49:37 1994', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('Sun, 06 Nov 1994 08:49:37 UTC', testFormat, expect(false));
  format('Sun, 32 Nov 1994 08:49:37 GMT', testFormat, expect(false));
  format('Sun, 06 Nov 1994 25:49:37 GMT', testFormat, expect(false));
  format('1994-11-06T08:49:37Z', testFormat, expect(false));
  format('yesterday', testFormat, expect(false));
  format('', testFormat, expect(false));
  format(784111777, testFormat, expect(false));
});

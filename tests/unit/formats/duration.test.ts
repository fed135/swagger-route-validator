import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'duration';

test(`Can detect valid ${testFormat} formats`, () => {
  format('P3Y6M4DT12H30M5S', testFormat, expect(true));
  format('P1W', testFormat, expect(true));
  format('PT36H', testFormat, expect(true));
  format('P1D', testFormat, expect(true));
  format('PT0S', testFormat, expect(true));
  format('P1Y2M3D', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('P', testFormat, expect(false));
  format('PT', testFormat, expect(false));
  format('1Y', testFormat, expect(false));
  format('P1Y2D', testFormat, expect(false));
  format('P1W2D', testFormat, expect(false));
  format('P-1D', testFormat, expect(false));
  format('P1.5D', testFormat, expect(false));
  format('PT1H2S', testFormat, expect(false));
  format('3 days', testFormat, expect(false));
  format(42, testFormat, expect(false));
});

import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'date';

test(`Can detect valid ${testFormat} formats`, () => {
  format('2002-10-02', testFormat, expect(true));
  format((new Date()).toLocaleDateString('fr-CA'), testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('2002-13-02', testFormat, expect(false));
  format('2002-10-32', testFormat, expect(false));
  format('10-02-2002', testFormat, expect(false));
  format('January 1st 2002', testFormat, expect(false));
  format(1557756500211, testFormat, expect(false));
});

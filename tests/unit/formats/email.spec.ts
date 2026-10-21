import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatString as format } from '../../../src/format.ts';

const testFormat = 'email';

test(`Can detect valid ${testFormat} formats`, () => {
  format('me@mail.com', testFormat, expect(true));
  format('me+spam@mail.com', testFormat, expect(true));
  format('me@mailcom', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('me@mail..com', testFormat, expect(false));
  format('mail.com', testFormat, expect(false));
  format('me @ mail . com', testFormat, expect(false));
  format(1557756500211, testFormat, expect(false));
});

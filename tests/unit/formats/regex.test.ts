import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'regex';

test(`Can detect valid ${testFormat} formats`, () => {
  format('^[a-z]+$', testFormat, expect(true));
  format('\\d{3}-\\d{4}', testFormat, expect(true));
  format('(?:a|b)*', testFormat, expect(true));
  format('.*', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('([', testFormat, expect(false));
  format('*abc', testFormat, expect(false));
  format('(?<n', testFormat, expect(false));
  format('[z-a]', testFormat, expect(false));
  format('a{2,1}', testFormat, expect(false));
});

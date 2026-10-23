import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'idn-email';

test(`Can detect valid ${testFormat} formats`, () => {
  format('user@example.com', testFormat, expect(true));
  format('first.last+tag@example.org', testFormat, expect(true));
  format('jörg@münchen.de', testFormat, expect(true));
  format('用户@例え.jp', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('user@', testFormat, expect(false));
  format('@example.com', testFormat, expect(false));
  format('user', testFormat, expect(false));
  format('user@@example.com', testFormat, expect(false));
  format('us er@example.com', testFormat, expect(false));
  format('user@exa mple.com', testFormat, expect(false));
  format('user@-bad.com', testFormat, expect(false));
});

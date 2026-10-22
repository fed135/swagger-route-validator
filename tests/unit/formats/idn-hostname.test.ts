import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'idn-hostname';

test(`Can detect valid ${testFormat} formats`, () => {
  format('example.com', testFormat, expect(true));
  format('münchen.de', testFormat, expect(true));
  format('例え.jp', testFormat, expect(true));
  format('xn--mnchen-3ya.de', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('a b.com', testFormat, expect(false));
  format('-bad.com', testFormat, expect(false));
  format('exa_mple.com', testFormat, expect(false));
  format('example..com', testFormat, expect(false));
});

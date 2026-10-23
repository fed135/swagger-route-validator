import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'hostname';

test(`Can detect valid ${testFormat} formats`, () => {
  format('example.com', testFormat, expect(true));
  format('localhost', testFormat, expect(true));
  format('a-b.example.co.uk', testFormat, expect(true));
  format('xn--mnchen-3ya.de', testFormat, expect(true));
  format('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('-example.com', testFormat, expect(false));
  format('example-.com', testFormat, expect(false));
  format('exa_mple.com', testFormat, expect(false));
  format('example..com', testFormat, expect(false));
  format('exa mple.com', testFormat, expect(false));
  format('münchen.de', testFormat, expect(false));
  format('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com', testFormat, expect(false));
});

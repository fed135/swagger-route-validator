import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'ipv6-cidr';

test(`Can detect valid ${testFormat} formats`, () => {
  format('2001:db8::/32', testFormat, expect(true));
  format('::/0', testFormat, expect(true));
  format('::1/128', testFormat, expect(true));
  format('fe80::/10', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('2001:db8::/129', testFormat, expect(false));
  format('2001:db8::', testFormat, expect(false));
  format('2001:db8::/', testFormat, expect(false));
  format('fe80::1%eth0/64', testFormat, expect(false));
  format('10.0.0.0/8', testFormat, expect(false));
  format('zzzz::/32', testFormat, expect(false));
  format('/64', testFormat, expect(false));
  format('', testFormat, expect(false));
});

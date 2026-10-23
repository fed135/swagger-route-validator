import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'ipv4-cidr';

test(`Can detect valid ${testFormat} formats`, () => {
  format('192.168.0.0/16', testFormat, expect(true));
  format('10.0.0.0/8', testFormat, expect(true));
  format('0.0.0.0/0', testFormat, expect(true));
  format('255.255.255.255/32', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('10.0.0.0/33', testFormat, expect(false));
  format('10.0.0.0', testFormat, expect(false));
  format('10.0.0.0/', testFormat, expect(false));
  format('10.0.0.0/-1', testFormat, expect(false));
  format('10.0.0.0/08', testFormat, expect(false));
  format('10.0.0.0/8/8', testFormat, expect(false));
  format('256.0.0.0/8', testFormat, expect(false));
  format('2001:db8::/32', testFormat, expect(false));
  format('/8', testFormat, expect(false));
  format('', testFormat, expect(false));
});

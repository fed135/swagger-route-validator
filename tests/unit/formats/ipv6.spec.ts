import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatString as format } from '../../../src/format.ts';

const testFormat = 'ipv6';

test(`Can detect valid ${testFormat} format number`, () => {
  format('1:2:3:4:5:6:7:8', testFormat, expect(true));
  format('1::', testFormat, expect(true));
  format('1::8', testFormat, expect(true));
  format('2001:db8:3:4::192.0.2.33', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('1', testFormat, expect(false));
  format(255, testFormat, expect(false));
  format('192.168.0.1', testFormat, expect(false));
});

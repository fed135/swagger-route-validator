import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatString as format } from '../../../src/format.ts';

const testFormat = 'ipv4';

test(`Can detect valid ${testFormat} format number`, () => {
  format('192.168.0.1', testFormat, expect(true));
  format('0.0.0.0', testFormat, expect(true));
  format('255.255.255.255', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('1', testFormat, expect(false));
  format(255, testFormat, expect(false));
  format('192.168.0.1:1', testFormat, expect(false));
  format('192.168.0.1.1', testFormat, expect(false));
  format('192.168.0.-1', testFormat, expect(false));
  format('0.0.0', testFormat, expect(false));
  format('256.256.256.256', testFormat, expect(false));
});

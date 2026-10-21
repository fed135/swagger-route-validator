import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatString as format } from '../../../src/format.ts';

const testFormat = 'uri';

test(`Can detect valid ${testFormat} formats`, () => {
  format('http://mail.com', testFormat, expect(true));
  format('ftp://mail.com', testFormat, expect(true));
  format('https://mail.com:9001', testFormat, expect(true));
  format('http://0.0.0.0', testFormat, expect(true));
  format('http://subdomain.site.org', testFormat, expect(true));
  format('http://subdomain.site.org/path', testFormat, expect(true));
  format('http://subdomain.site.org/path?param=test', testFormat, expect(true));
  format('http://mailcom', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('//mail.com', testFormat, expect(false));
  format('mailcom', testFormat, expect(false));
  format('mail..com', testFormat, expect(false));
  format('mail com', testFormat, expect(false));
  format('subdomain.site.org\\path?param=test', testFormat, expect(false));
  format(1557756500211, testFormat, expect(false));
});

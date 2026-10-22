import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'iri';

test(`Can detect valid ${testFormat} formats`, () => {
  format('https://example.com/path', testFormat, expect(true));
  format('https://例え.jp/パス', testFormat, expect(true));
  format('mailto:user@example.com', testFormat, expect(true));
  format('urn:isbn:0451450523', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('/relative/path', testFormat, expect(false));
  format('example.com', testFormat, expect(false));
  format('', testFormat, expect(false));
  format('https://exa mple.com', testFormat, expect(false));
  format('https://example.com/<x>', testFormat, expect(false));
  format('https://example.com/%zz', testFormat, expect(false));
});

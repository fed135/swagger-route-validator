import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'iri-reference';

test(`Can detect valid ${testFormat} formats`, () => {
  format('/relative/パス', testFormat, expect(true));
  format('../up', testFormat, expect(true));
  format('#fragment', testFormat, expect(true));
  format('?q=1', testFormat, expect(true));
  format('', testFormat, expect(true));
  format('https://例え.jp/パス', testFormat, expect(true));
  format('https://example.com/a%20b', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('a b', testFormat, expect(false));
  format('/path with space', testFormat, expect(false));
  format('%zz', testFormat, expect(false));
  format('/a<b>', testFormat, expect(false));
  format('/a|b', testFormat, expect(false));
  format('/a\\b', testFormat, expect(false));
});

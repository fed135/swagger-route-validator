import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'uri-reference';

test(`Can detect valid ${testFormat} formats`, () => {
  format('/relative', testFormat, expect(true));
  format('../up?x=1#y', testFormat, expect(true));
  format('#fragment', testFormat, expect(true));
  format('', testFormat, expect(true));
  format('https://example.com/a%20b', testFormat, expect(true));
  format('//example.com/path', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('/パス', testFormat, expect(false));
  format('a b', testFormat, expect(false));
  format('%zz', testFormat, expect(false));
  format('/a|b', testFormat, expect(false));
  format('/a\\b', testFormat, expect(false));
  format('/a<b>', testFormat, expect(false));
});

import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'sf-token';

test(`Can detect valid ${testFormat} formats`, () => {
  format('foo', testFormat, expect(true));
  format('foo123/456', testFormat, expect(true));
  format('*bar', testFormat, expect(true));
  format('text/html', testFormat, expect(true));
  format('a:b', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('1abc', testFormat, expect(false));
  format('-foo', testFormat, expect(false));
  format('foo bar', testFormat, expect(false));
  format('"quoted"', testFormat, expect(false));
  format(42, testFormat, expect(false));
});

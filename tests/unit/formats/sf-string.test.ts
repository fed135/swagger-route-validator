import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'sf-string';

test(`Can detect valid ${testFormat} formats`, () => {
  format('"hello"', testFormat, expect(true));
  format('""', testFormat, expect(true));
  format('"say \\"hi\\""', testFormat, expect(true));
  format('"back\\\\slash"', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('hello', testFormat, expect(false));
  format('"unterminated', testFormat, expect(false));
  format('"bad\\nescape"', testFormat, expect(false));
  format('"tab\there"', testFormat, expect(false));
  format('"café"', testFormat, expect(false));
  format(42, testFormat, expect(false));
});

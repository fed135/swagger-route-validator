import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'language';

test(`Can detect valid ${testFormat} formats`, () => {
  format('en', testFormat, expect(true));
  format('en-CA', testFormat, expect(true));
  format('zh-Hant-TW', testFormat, expect(true));
  format('zh-yue', testFormat, expect(true));
  format('sl-rozaj-biske', testFormat, expect(true));
  format('de-CH-1901', testFormat, expect(true));
  format('en-US-x-twain', testFormat, expect(true));
  format('x-private', testFormat, expect(true));
  format('i-klingon', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('e', testFormat, expect(false));
  format('en_US', testFormat, expect(false));
  format('en-', testFormat, expect(false));
  format('en--US', testFormat, expect(false));
  format('toolongsubtagxx', testFormat, expect(false));
  format('english language', testFormat, expect(false));
  format(123, testFormat, expect(false));
});

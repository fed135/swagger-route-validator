import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'media-range';

test(`Can detect valid ${testFormat} formats`, () => {
  format('*/*', testFormat, expect(true));
  format('text/*', testFormat, expect(true));
  format('text/html', testFormat, expect(true));
  format('application/json;q=0.9', testFormat, expect(true));
  format('text/html; charset="utf-8"', testFormat, expect(true));
  format('text/plain ; format=flowed', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('text', testFormat, expect(false));
  format('/json', testFormat, expect(false));
  format('text/', testFormat, expect(false));
  format('text/html;charset', testFormat, expect(false));
  format('text/html; =x', testFormat, expect(false));
  format('text/ht ml', testFormat, expect(false));
  format(42, testFormat, expect(false));
});

import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'html';

// html is annotation-only: it hints at the content, so any string is accepted.

test(`Can detect valid ${testFormat} formats`, () => {
  format('<p>Hello <b>world</b></p>', testFormat, expect(true));
  format('plain text', testFormat, expect(true));
  format('', testFormat, expect(true));
});

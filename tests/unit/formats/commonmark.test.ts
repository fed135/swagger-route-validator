import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'commonmark';

// commonmark is annotation-only: it hints at the content, so any string is accepted.

test(`Can detect valid ${testFormat} formats`, () => {
  format('# Heading\n\nSome *emphasis* and a [link](https://example.com)', testFormat, expect(true));
  format('plain text', testFormat, expect(true));
  format('', testFormat, expect(true));
});

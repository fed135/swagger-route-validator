import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'base64url';

// base64url is annotation-only: it hints at the content, so any string is accepted.

test(`Can detect valid ${testFormat} formats`, () => {
  format('aGVsbG8', testFormat, expect(true));
  format('aGk-_w==', testFormat, expect(true));
  format('anything is accepted, this format is deprecated and annotation-only', testFormat, expect(true));
});

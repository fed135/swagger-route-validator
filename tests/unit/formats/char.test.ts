import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'char';

test(`Can detect valid ${testFormat} formats`, () => {
  format('a', testFormat, expect(true));
  format('Z', testFormat, expect(true));
  format('7', testFormat, expect(true));
  format(' ', testFormat, expect(true));
  format('😀', testFormat, expect(true));
  format('é', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('ab', testFormat, expect(false));
  format('😀😀', testFormat, expect(false));
  format('hello', testFormat, expect(false));
});

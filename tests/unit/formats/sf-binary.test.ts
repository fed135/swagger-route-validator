import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'sf-binary';

test(`Can detect valid ${testFormat} formats`, () => {
  format(':cHJldGVuZA==:', testFormat, expect(true));
  format('::', testFormat, expect(true));
  format(':aGVsbG8=:', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('cHJldGVuZA==', testFormat, expect(false));
  format(':cHJl', testFormat, expect(false));
  format(':cHJl!:', testFormat, expect(false));
  format('?1', testFormat, expect(false));
  format('::::', testFormat, expect(false));
  format(42, testFormat, expect(false));
});

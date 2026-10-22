import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'sf-boolean';

test(`Can detect valid ${testFormat} formats`, () => {
  format('?0', testFormat, expect(true));
  format('?1', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('0', testFormat, expect(false));
  format('1', testFormat, expect(false));
  format('?2', testFormat, expect(false));
  format('true', testFormat, expect(false));
  format('?', testFormat, expect(false));
  format('?10', testFormat, expect(false));
  format(1, testFormat, expect(false));
});

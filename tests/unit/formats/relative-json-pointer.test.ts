import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'relative-json-pointer';

test(`Can detect valid ${testFormat} formats`, () => {
  format('0', testFormat, expect(true));
  format('1/foo', testFormat, expect(true));
  format('2/highly/nested/objects', testFormat, expect(true));
  format('0#', testFormat, expect(true));
  format('12#', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('', testFormat, expect(false));
  format('01', testFormat, expect(false));
  format('-1', testFormat, expect(false));
  format('/foo', testFormat, expect(false));
  format('1/a~2', testFormat, expect(false));
  format('#', testFormat, expect(false));
  format('1/foo~2', testFormat, expect(false));
});

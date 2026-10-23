import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'json-pointer';

test(`Can detect valid ${testFormat} formats`, () => {
  format('', testFormat, expect(true));
  format('/', testFormat, expect(true));
  format('/foo', testFormat, expect(true));
  format('/foo/0', testFormat, expect(true));
  format('/a~1b', testFormat, expect(true));
  format('/m~0n', testFormat, expect(true));
  format('/with-dash-token', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('foo', testFormat, expect(false));
  format('/a~2', testFormat, expect(false));
  format('/a~', testFormat, expect(false));
  format('#/foo', testFormat, expect(false));
  format('foo/bar', testFormat, expect(false));
  format(123, testFormat, expect(false));
});

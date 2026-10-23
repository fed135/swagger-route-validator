import { test } from 'node:test';
import { expect } from '../utils.ts';
import { formatString as format } from '../../../src/format.ts';

const testFormat = 'uuid';

test(`Can detect valid ${testFormat} formats`, () => {
  format('f37bfdec-bdda-4c07-9ba9-09f99885a5ff', testFormat, expect(true));
  format('3b55e1ae-6ccb-4149-91e8-4c8920fb4465', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('3b55e1ae-6ccb-4149-91e84c8920fb4465', testFormat, expect(false));
  format('3b55e1ae-$ccb-4149-91e8-4c8920fb4465', testFormat, expect(false));
  format('3b55e1ae 6ccb 4149 91e8 4c8920fb4465', testFormat, expect(false));
  format('3b55e1ae6ccb414991e84c8920fb4465', testFormat, expect(false));
  format(1557756500211, testFormat, expect(false));
});

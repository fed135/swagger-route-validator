const format = require('../../../src/format');

const testFormat = 'uuid';

test(`Can detect valid ${testFormat} formats`, () => {
  expect(format('', 'f37bfdec-bdda-4c07-9ba9-09f99885a5ff', testFormat, []).length).toBe(0);
  expect(format('', '3b55e1ae-6ccb-4149-91e8-4c8920fb4465', testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '3b55e1ae-6ccb-4149-91e84c8920fb4465', testFormat, []).length).toBe(1);
  expect(format('', '3b55e1ae-$ccb-4149-91e8-4c8920fb4465', testFormat, []).length).toBe(1);
  expect(format('', '3b55e1ae 6ccb 4149 91e8 4c8920fb4465', testFormat, []).length).toBe(1);
  expect(format('', '3b55e1ae6ccb414991e84c8920fb4465', testFormat, []).length).toBe(1);
  expect(format('', 1557756500211, testFormat, []).length).toBe(1);
});
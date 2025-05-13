import {format} from '../../../src/format';

const testFormat = 'int32';

test(`Can detect valid ${testFormat} format number`, () => {
  expect(format('', 1, testFormat, []).length).toBe(0);
  expect(format('', 0, testFormat, []).length).toBe(0);
  expect(format('', -1, testFormat, []).length).toBe(0);
  expect(format('', -2147483648, testFormat, []).length).toBe(0);
  expect(format('', 2147483647, testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '1', testFormat, []).length).toBe(1);
  expect(format('', 'a', testFormat, []).length).toBe(1);
  expect(format('', 0.5, testFormat, []).length).toBe(1);
  expect(format('', -2147483649, testFormat, []).length).toBe(1);
  expect(format('', 2147483648, testFormat, []).length).toBe(1);
});

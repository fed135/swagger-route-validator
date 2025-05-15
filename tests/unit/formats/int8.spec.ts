import {format} from '../../../src/format';

const testFormat = 'int8';

test(`Can detect valid ${testFormat} format number`, () => {
  expect(format('', 1, testFormat, []).length).toBe(0);
  expect(format('', 0, testFormat, []).length).toBe(0);
  expect(format('', -1, testFormat, []).length).toBe(0);
  expect(format('', -128, testFormat, []).length).toBe(0);
  expect(format('', 127, testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '1', testFormat, []).length).toBe(1);
  expect(format('', 'a', testFormat, []).length).toBe(1);
  expect(format('', 0.5, testFormat, []).length).toBe(1);
  expect(format('', -129, testFormat, []).length).toBe(1);
  expect(format('', 128, testFormat, []).length).toBe(1);
});

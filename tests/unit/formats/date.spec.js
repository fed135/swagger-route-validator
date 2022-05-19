const format = require('../../../src/format');

const testFormat = 'date';

test(`Can detect valid ${testFormat} formats`, () => {
  expect(format('', '2002-10-02', testFormat, []).length).toBe(0);
  expect(format('', (new Date()).toLocaleDateString(), testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '2002-13-02', testFormat, []).length).toBe(1);
  expect(format('', '2002-10-32', testFormat, []).length).toBe(1);
  expect(format('', '10-02-2002', testFormat, []).length).toBe(1);
  expect(format('', 'January 1st 2002', testFormat, []).length).toBe(1);
  expect(format('', 1557756500211, testFormat, []).length).toBe(1);
});
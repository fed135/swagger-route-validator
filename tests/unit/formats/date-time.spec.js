const format = require('../../../src/format');

const testFormat = 'date-time';

test(`Can detect valid ${testFormat} formats`, () => {
  expect(format('', '2002-10-02T10:00:00-05:00', testFormat, []).length).toBe(0);
  expect(format('', '2002-10-02T15:00:00Z', testFormat, []).length).toBe(0);
  expect(format('', '2002-10-02T15:00:00.05Z', testFormat, []).length).toBe(0);
  expect(format('', (new Date()).toISOString(), testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '2002-13-02T15:00:00Z', testFormat, []).length).toBe(1);
  expect(format('', '2002-10-02 15:00:00', testFormat, []).length).toBe(1);
  expect(format('', '10-02-2002', testFormat, []).length).toBe(1);
  expect(format('', 'January 1st 2002', testFormat, []).length).toBe(1);
  expect(format('', 1557756500211, testFormat, []).length).toBe(1);
});
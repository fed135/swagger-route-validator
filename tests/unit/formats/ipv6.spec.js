const format = require('../../../src/format');

const testFormat = 'ipv6';

test(`Can detect valid ${testFormat} format number`, () => {
  expect(format('', '1:2:3:4:5:6:7:8', testFormat, []).length).toBe(0);
  expect(format('', '1::', testFormat, []).length).toBe(0);
  expect(format('', '1::8', testFormat, []).length).toBe(0);
  expect(format('', '2001:db8:3:4::192.0.2.33', testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '1', testFormat, []).length).toBe(1);
  expect(format('', 255, testFormat, []).length).toBe(1);
  expect(format('', '192.168.0.1', testFormat, []).length).toBe(1);
});
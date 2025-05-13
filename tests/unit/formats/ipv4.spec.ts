import {format} from '../../../src/format';

const testFormat = 'ipv4';

test(`Can detect valid ${testFormat} format number`, () => {
  expect(format('', '192.168.0.1', testFormat, []).length).toBe(0);
  expect(format('', '0.0.0.0', testFormat, []).length).toBe(0);
  expect(format('', '255.255.255.255', testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '1', testFormat, []).length).toBe(1);
  expect(format('', 255, testFormat, []).length).toBe(1);
  expect(format('', '192.168.0.1:1', testFormat, []).length).toBe(1);
  expect(format('', '192.168.0.1.1', testFormat, []).length).toBe(1);
  expect(format('', '192.168.0.-1', testFormat, []).length).toBe(1);
  expect(format('', '0.0.0', testFormat, []).length).toBe(1);
  expect(format('', '256.256.256.256', testFormat, []).length).toBe(1);
});

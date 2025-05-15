import {format} from '../../../src/format';

const testFormat = 'email';

test(`Can detect valid ${testFormat} formats`, () => {
  expect(format('', 'me@mail.com', testFormat, []).length).toBe(0);
  expect(format('', 'me+spam@mail.com', testFormat, []).length).toBe(0);
  expect(format('', 'me@mailcom', testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', 'me@mail..com', testFormat, []).length).toBe(1);
  expect(format('', 'mail.com', testFormat, []).length).toBe(1);
  expect(format('', 'me @ mail . com', testFormat, []).length).toBe(1);
  expect(format('', 1557756500211, testFormat, []).length).toBe(1);
});

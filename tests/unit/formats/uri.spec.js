const format = require('../../../src/format');

const testFormat = 'uri';

test(`Can detect valid ${testFormat} formats`, () => {
  expect(format('', 'http://mail.com', testFormat, []).length).toBe(0);
  expect(format('', 'ftp://mail.com', testFormat, []).length).toBe(0);
  expect(format('', 'https://mail.com:9001', testFormat, []).length).toBe(0);
  expect(format('', 'http://0.0.0.0', testFormat, []).length).toBe(0);
  expect(format('', 'http://subdomain.site.org', testFormat, []).length).toBe(0);
  expect(format('', 'http://subdomain.site.org/path', testFormat, []).length).toBe(0);
  expect(format('', 'http://subdomain.site.org/path?param=test', testFormat, []).length).toBe(0);
  expect(format('', 'http://mailcom', testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
  expect(format('', '//mail.com', testFormat, []).length).toBe(1);
  expect(format('', 'mailcom', testFormat, []).length).toBe(1);
  expect(format('', 'mail..com', testFormat, []).length).toBe(1);
  expect(format('', 'mail com', testFormat, []).length).toBe(1);
  expect(format('', 'subdomain.site.org\\path?param=test', testFormat, []).length).toBe(1);
  expect(format('', 1557756500211, testFormat, []).length).toBe(1);
});
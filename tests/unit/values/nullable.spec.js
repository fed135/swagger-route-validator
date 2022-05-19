const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = 'nullable';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', undefined, { [testValue]: true, type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', 'abc', { [testValue]: true, type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values mixed with default`, () => {
  expect(values('', undefined, { [testValue]: true, type: 'string', default: 'a' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values mixed with required`, () => {
  expect(values('', undefined, { [testValue]: true, type: 'string', required: true }, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testValue} values mixed with required and default`, () => {
  expect(values('', undefined, { [testValue]: true, type: 'string', required: true, default: 'a' }, setDefault, []).length).toBe(1);
});
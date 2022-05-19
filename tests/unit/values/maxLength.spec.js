const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = 'maxLength';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 'a', { [testValue]: '1', type: 'string' }, setDefault, []).length).toBe(0);
  expect(values('', '1', { [testValue]: '3', type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', '123', { [testValue]: '2', type: 'string' }, setDefault, []).length).toBe(1);
});
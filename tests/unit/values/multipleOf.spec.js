const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = 'multipleOf';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 9, { [testValue]: 3, type: 'number' }, setDefault, []).length).toBe(0);
  expect(values('', 100, { [testValue]: 10, type: 'integer' }, setDefault, []).length).toBe(0);
  expect(values('', 3, { [testValue]: 3, type: 'number' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', 3.5, { [testValue]: 3, type: 'number' }, setDefault, []).length).toBe(1);
  expect(values('', 4, { [testValue]: 3, type: 'integer' }, setDefault, []).length).toBe(1);
});
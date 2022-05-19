const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = '$anyOf';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 2.5, { [testValue]: { type: 'number', minimum: 2}, type: 'number' }, setDefault, []).length).toBe(0);
  expect(values('', 2, { [testValue]: [{ type: 'number', minimum: 2}, { type: 'number', minimum: 3}], type: 'integer' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', 3, { [testValue]: { type: 'number', minimum: 5}, type: 'number' }, setDefault, []).length).toBe(1);
  expect(values('', 3.5, { [testValue]: [{ type: 'string'}], type: 'number' }, setDefault, []).length).toBe(1);
});

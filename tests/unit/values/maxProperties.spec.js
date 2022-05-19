const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = 'maxProperties';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', { foo: 1 }, { [testValue]: 1, type: 'object' }, setDefault, []).length).toBe(0);
  expect(values('', { foo: 1, bar: 2, baz: 3 }, { [testValue]: 3, type: 'object' }, setDefault, []).length).toBe(0);
  expect(values('', {}, { [testValue]: 3, type: 'object' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', { foo: 1, bar: 2, baz: 3 }, { [testValue]: 1, type: 'object' }, setDefault, []).length).toBe(1);
});
const {type} = require('../../../src/valueValidator');

const testType = 'string';
const setDefault = () => {};
const specs = {};

test(`Can detect valid ${testType} typing`, () => {
  expect(type('', 'a', testType, specs, setDefault, []).length).toBe(0);
  expect(type('', '0', testType, specs, setDefault, []).length).toBe(0);
  expect(type('', 'true', testType, specs, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
  expect(type('', true, testType, specs, setDefault, []).length).toBe(1);
  expect(type('', 1, testType, specs, setDefault, []).length).toBe(1);
  expect(type('', 0.5, testType, specs, setDefault, []).length).toBe(1);
  expect(type('', { foo: 'bar' }, testType, specs, setDefault, []).length).toBe(1);
  expect(type('', [1,2,3], testType, specs, setDefault, []).length).toBe(1);
});
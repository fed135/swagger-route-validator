const values = require('../../../src/valueValidator').validateValue;

const setDefault = () => {};
const testValue = 'minItems';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', ['foo'], { [testValue]: 1, type: 'array' }, setDefault, []).length).toBe(0);
  expect(values('', ['foo', 'bar', 'baz'], { [testValue]: 1, type: 'array' }, setDefault, []).length).toBe(0);
  expect(values('', [], { [testValue]: 0, type: 'array' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', [], { [testValue]: 1, type: 'array' }, setDefault, []).length).toBe(1);
});
const {validateValue, set} = require('../../../src/valueValidator');

const testValue = 'default';

test(`Can apply ${testValue} values`, () => {
  const obj = {};
  expect(validateValue('foo', obj.foo, { [testValue]: 'a', type: 'string' }, set(obj), []).length).toBe(0);
  expect(obj.foo).toBe('a');
});

test(`Can apply nested ${testValue} values`, () => {
  const obj = { bar: {} };
  expect(validateValue('bar.foo', obj.bar.foo, { [testValue]: 'a', type: 'string' }, set(obj), []).length).toBe(0);
  expect(obj.bar.foo).toBe('a');
});

test('Can passively apply typed values for integers', () => {
  const obj = { bar: '1' };
  expect(validateValue('bar', obj.bar, { [testValue]: 2, type: 'integer' }, set(obj), []).length).toBe(0);
  expect(obj.bar).toBe(1);
});

test('Can passively apply typed values for numbers', () => {
  const obj = { bar: '.5' };
  expect(validateValue('bar', obj.bar, { [testValue]: 1, type: 'number' }, set(obj), []).length).toBe(0);
  expect(obj.bar).toBe(0.5);
});

test('Can passively apply typed values for booleans', () => {
  const obj = { bar: 'false' };
  expect(validateValue('bar', obj.bar, { [testValue]: true, type: 'boolean' }, set(obj), []).length).toBe(0);
  expect(obj.bar).toBe(false);
});
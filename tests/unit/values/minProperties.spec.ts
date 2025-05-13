import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'minProperties';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', { foo: 1 }, { [testValue]: 1, type: 'object' }, setDefault, []).length).toBe(0);
  expect(values('', { foo: 1, bar: 2, baz: 3 }, { [testValue]: 1, type: 'object' }, setDefault, []).length).toBe(0);
  expect(values('', {}, { [testValue]: 0, type: 'object' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', {}, { [testValue]: 1, type: 'object' }, setDefault, []).length).toBe(1);
});

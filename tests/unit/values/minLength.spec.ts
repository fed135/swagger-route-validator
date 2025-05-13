import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'minLength';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 'abc', { [testValue]: '1', type: 'string' }, setDefault, []).length).toBe(0);
  expect(values('', '123', { [testValue]: '3', type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', '123', { [testValue]: '5', type: 'string' }, setDefault, []).length).toBe(1);
});

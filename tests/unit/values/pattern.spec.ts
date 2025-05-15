import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'pattern';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 'abc', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, []).length).toBe(0);
  expect(values('', '123', { [testValue]: '[0-9]', type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', '123', { [testValue]: '[a-zA-Z]', type: 'string' }, setDefault, []).length).toBe(1);
  expect(values('', 'abc', { [testValue]: '[0-9]', type: 'string' }, setDefault, []).length).toBe(1);
});

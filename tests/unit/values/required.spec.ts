import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'required';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 'abc', { [testValue]: true, type: 'string' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', undefined, { [testValue]: true, type: 'string' }, setDefault, []).length).toBe(1);
});

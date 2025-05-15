import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'minimum';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 3.6, { [testValue]: 3.5, type: 'number' }, setDefault, []).length).toBe(0);
  expect(values('', -2, { [testValue]: -3, type: 'integer' }, setDefault, []).length).toBe(0);
  expect(values('', 3, { [testValue]: 3, type: 'number' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', 3.4, { [testValue]: 3.5, type: 'number' }, setDefault, []).length).toBe(1);
  expect(values('', -2, { [testValue]: 3, type: 'integer' }, setDefault, []).length).toBe(1);
});

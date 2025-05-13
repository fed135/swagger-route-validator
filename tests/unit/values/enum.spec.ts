import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'enum';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', 'a', { [testValue]: ['a', 'b', 'c'], type: 'string' }, setDefault, []).length).toBe(0);
  expect(values('', 0, { [testValue]: [0, 1, 2], type: 'integer' }, setDefault, []).length).toBe(0);
  expect(values('', true, { [testValue]: [true], type: 'boolean' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', 'd', { [testValue]: ['a', 'b', 'c'], type: 'string' }, setDefault, []).length).toBe(1);
  expect(values('', -1, { [testValue]: [0, 1, 2], type: 'integer' }, setDefault, []).length).toBe(1);
  expect(values('', false, { [testValue]: [true], type: 'boolean' }, setDefault, []).length).toBe(1);
});

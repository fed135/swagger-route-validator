import { validateValue as values } from '../../../src/valueValidator';

const setDefault = () => {};
const testValue = 'maxItems';

test(`Can detect valid ${testValue} values`, () => {
  expect(values('', ['foo'], { [testValue]: 1, type: 'array' }, setDefault, []).length).toBe(0);
  expect(values('', ['foo', 'bar', 'baz'], { [testValue]: 3, type: 'array' }, setDefault, []).length).toBe(0);
  expect(values('', [], { [testValue]: 3, type: 'array' }, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testValue} values`, () => {
  expect(values('', ['foo', 'bar', 'baz'], { [testValue]: 1, type: 'array' }, setDefault, []).length).toBe(1);
});

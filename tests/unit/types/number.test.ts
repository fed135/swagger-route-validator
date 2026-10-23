import { test } from 'node:test';
import { expect } from '../utils.ts';
import { type } from '../../../src/valueValidator.ts';

const testType = 'number';
const setDefault = () => {};
const specs = {};

test(`Can detect valid ${testType} typing`, () => {
  type('', 1, testType, specs, setDefault, {}, expect(true));
  type('', 0, testType, specs, setDefault, {}, expect(true));
  type('', -1, testType, specs, setDefault, {}, expect(true));
  type('', 0.5, testType, specs, setDefault, {}, expect(true));
  type('', '0.5', testType, specs, setDefault, {}, expect(true));
});

test(`Can detect invalid ${testType} typings`, () => {
  type('', 'a', testType, specs, setDefault, {}, expect(false));
  type('', { foo: 'bar' }, testType, specs, setDefault, {}, expect(false));
  type('', [1, 2, 3], testType, specs, setDefault, {}, expect(false));
});

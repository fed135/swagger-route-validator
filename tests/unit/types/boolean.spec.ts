import { test } from 'node:test';
import { expect } from '../utils.ts';
import { type } from '../../../src/valueValidator.ts';

const testType = 'boolean';
const setDefault = () => {};
const specs = {};

test(`Can detect valid ${testType} typing`, () => {
  type('', true, testType, specs, setDefault, {}, expect(true));
  type('', false, testType, specs, setDefault, {}, expect(true));
  type('', 'true', testType, specs, setDefault, {}, expect(true));
  type('', 'false', testType, specs, setDefault, {}, expect(true));
});

test(`Can detect invalid ${testType} typings`, () => {
  type('', 1, testType, specs, setDefault, {}, expect(false));
  type('', 'a', testType, specs, setDefault, {}, expect(false));
  type('', 0.5, testType, specs, setDefault, {}, expect(false));
  type('', { foo: 'bar' }, testType, specs, setDefault, {}, expect(false));
  type('', [1, 2, 3], testType, specs, setDefault, {}, expect(false));
});

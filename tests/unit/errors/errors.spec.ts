import { test } from 'node:test';
import {makeError} from '../../../src/error.ts';

test('error formatting', () => {
  expect(makeError('a.b.c', { foo: 'bar' }, 'This is an error')).toStrictEqual({ cursor: 'a.b.c', error: 'This is an error' });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {makeError} from '../../../src/error.ts';

test('error formatting', () => {
  assert.deepStrictEqual(makeError('a.b.c', { foo: 'bar' }, 'This is an error'), { cursor: 'a.b.c', error: 'This is an error' });
});

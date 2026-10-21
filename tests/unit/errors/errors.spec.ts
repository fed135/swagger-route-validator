import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accumulator } from '../../../src/error.ts';

test('error formatting', () => {
  const errors = [];
  const failIf = accumulator('test', errors);

  assert.deepStrictEqual(failIf(true, 'a.b.c'), true);
  assert.deepStrictEqual(failIf(false, 'a.b.c'), false);
  assert.deepStrictEqual(errors, [{ cursor: 'test', error: 'a.b.c' }]);
});

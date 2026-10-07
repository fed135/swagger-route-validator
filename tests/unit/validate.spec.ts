import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../src/index.ts';

test('valid plain integer schema', () => {
  assert.strictEqual(validate({ type: 'integer' }, 123).length, 0);
});

test('invalid plain integer schema', () => {
  assert.strictEqual(validate({ type: 'integer' }, 'abc').length, 1);
});

test('valid nested integer schema', () => {
  assert.strictEqual(validate({ type: 'object', properties: { foo: { type: 'integer' } } }, { foo: 123 }).length, 0);
});

test('invalid nested integer schema', () => {
  assert.strictEqual(validate({ type: 'object', properties: { foo: { type: 'integer' } } }, { foo: 'abc' }).length, 1);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../src/index.ts';

test('valid plain integer schema', () => {
  assert.strictEqual(validate({ type: 'integer' }, 123, undefined, true).length, 0);
});

test('valid plain integer schema ', () => {
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

test('valid nested integer schema with coerce true', () => {
  const value = { foo: '123' };
  assert.strictEqual(validate({ type: 'object', properties: { foo: { type: 'integer' } } }, value, undefined, true).length, 0);
  assert.strictEqual(value.foo, 123);
});

test('valid nested integer schema with coerce false', () => {
  const value = { foo: '123' };
  assert.strictEqual(validate({ type: 'object', properties: { foo: { type: 'integer' } } }, value, undefined, false).length, 0);
  assert.strictEqual(value.foo, '123');
});

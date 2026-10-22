import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../../../src/request.ts';
import { generateRequest } from '../utils.ts';

const spec = {
  parameters: [
    {
      name: 'id',
      in: 'query',
      schema: {
        type: 'integer',
      },
      required: true,
    },
  ],
};

test('checks presence of required query parameter', () => {
  assert.strictEqual(validateRequest(spec, generateRequest({ query: { id: '123' } })).length, 0);
});

test('errors on missing query parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest()), [{ cursor: 'query.id', error: 'Value is required and was not provided' }]);
});

test('errors on invalid query parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest({ query: { id: 'abc' } })), [{ cursor: 'query.id', error: 'Value is not an integer' }]);
});

test('checks coercion application to req\'s query parameter', () => {
  const request = generateRequest({ query: { id: '123' } });
  assert.strictEqual(validateRequest(spec, request, undefined, true).length, 0);
  assert.strictEqual(request.query.id, 123);
});

test('checks with disabled coercion to req\'s query parameter', () => {
  const request = generateRequest({ query: { id: '123' } });
  assert.strictEqual(validateRequest(spec, request, undefined, false).length, 0);
  assert.strictEqual(request.query.id, '123');
});

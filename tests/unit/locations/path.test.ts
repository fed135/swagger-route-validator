import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../../../src/request.ts';
import { generateRequest } from '../utils.ts';

const spec = {
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: {
        type: 'integer',
      },
    },
  ],
};

test('checks presence of required path parameter', () => {
  assert.strictEqual(validateRequest(spec, generateRequest({ params: { id: '123' } })).length, 0);
});

test('errors on missing path parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest()), [{ cursor: 'path.id', error: 'Value is required and was not provided' }]);
});

test('errors on invalid path parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest({ params: { id: 'abc' } })), [{ cursor: 'path.id', error: 'Value is not an integer' }]);
});

test('checks coercion application to req\'s path parameter', () => {
  const request = generateRequest({ params: { id: '123' } });
  assert.strictEqual(validateRequest(spec, request, undefined, true).length, 0);
  assert.strictEqual(request.params.id, 123);
});

test('checks with disabled coercion to req\'s path parameter', () => {
  const request = generateRequest({ params: { id: '123' } });
  assert.strictEqual(validateRequest(spec, request, undefined, false).length, 0);
  assert.strictEqual(request.params.id, '123');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../../../src/request.ts';
import { generateRequest } from '../utils.ts';

const spec = {
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      schema: {
        type: 'string',
        pattern: '^Bearer [A-Za-z0-9]+$',
      },
      required: true,
    },
    {
      name: 'x-request-id',
      in: 'header',
      schema: {
        type: 'integer',
      },
    },
  ],
};

test('checks presence of required header parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest({ headers: { authorization: 'Bearer abc' } })), []);
});

test('errors on missing header parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest()), [{ cursor: 'header.Authorization', error: 'Value is required and was not provided' }]);
});

test('errors on invalid header parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest({ headers: { authorization: 'Invalid' } })), [{ cursor: 'header.Authorization', error: 'Value does not match pattern ^Bearer [A-Za-z0-9]+$' }]);
});

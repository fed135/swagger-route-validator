import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../../../src/request.ts';
import { generateRequest } from '../utils.ts';

const spec = {
  parameters: [
    {
      name: 'username',
      in: 'cookie',
      schema: {
        type: 'string',
      },
    },
    {
      name: 'userid',
      in: 'cookie',
      schema: {
        type: 'integer',
      },
      required: true,
    },
  ],
};

test('checks presence of required cookie parameter', () => {
  assert.strictEqual(validateRequest(spec, generateRequest({ headers: { cookie: 'userid=123;' } })).length, 0);
});

test('checks presence of multiple cookie parameters', () => {
  assert.strictEqual(validateRequest(spec, generateRequest({ headers: { cookie: 'username=foo;userid=123;' } })).length, 0);
});

test('checks support of mismatched cookie header casing', () => {
  assert.strictEqual(validateRequest(spec, generateRequest({ headers: { cookie: 'userid=123;' } })).length, 0);
});

test('errors on missing cookie parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest()), [{ cursor: 'cookie.userid', error: 'Value is required and was not provided' }]);
});

test('errors on invalid cookie parameter', () => {
  assert.deepStrictEqual(validateRequest(spec, generateRequest({ headers: { cookie: 'userid=abc;' } })), [{ cursor: 'cookie.userid', error: 'Value is not an integer' }]);
});

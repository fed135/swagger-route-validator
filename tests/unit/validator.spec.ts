import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../../src/request.ts';
import { validateResponse } from '../../src/response.ts';

const spec = {
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
    },
  ],
  operationId: 'getPetById',
  responses: {
    200: { description: 'ok', type: 'object' },
  },
};

const badSpec = {
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'bad-type',
      },
    },
  ],
  operationId: 'getPetById',
  responses: {
    200: { description: 'ok', type: 'bad-type' },
  },
};

const request = {
  url: '/',
  params: {
    id: '123',
  },
  method: 'get',
};

const res = {
  get: () => 'header',
  req: request,
  statusCode: 200,
};

test('request valid spec', () => {
  assert.strictEqual(validateRequest(spec, request).length, 0);
});

test('request invalid spec', () => {
  assert.throws(validateRequest.bind(null, badSpec, request), 'a');
});

test('response valid spec', () => {
  assert.strictEqual(validateResponse(spec, request, res).length, 0);
});

test('response invalid spec', () => {
  assert.throws(validateResponse.bind(null, badSpec, request, res), 'a');
});

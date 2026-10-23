import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest as validator } from '../../src/request.ts';
import { generateRequest } from './utils.ts';

describe('Given a valid spec with body parameters', () => {
  const spec = {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              operationId: {
                type: 'string',
              },
            },
            required: ['operationId'],
          },
        },
      },
    },
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };

  test('Should return return no errors for a valid data type', () => {
    const request = generateRequest({ body: { operationId: '123' }, method: 'post' });
    assert.deepStrictEqual(validator(spec, request), []);
  });

  test('Should return return errors for missin fields', () => {
    const request = generateRequest({ body: { foo: 'abc' }, method: 'post' });
    assert.deepStrictEqual(validator(spec, request), [{
      cursor: 'body',
      error: 'Value is missing required keys [operationId]',
    }]);
  });
});

describe('Given a valid spec with definitions', () => {
  const spec = {
    definitions: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
        },
        required: ['id'],
      },
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/definitions/User',
          },
        },
      },
    },
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };

  test('Should return return no errors for a valid ref', () => {
    const request = generateRequest({ body: { id: '123' }, method: 'post' });
    assert.deepStrictEqual(validator(spec, request, spec), []);
  });

  test('Should return return an errors for an existing but incorrect ref', () => {
    const request = generateRequest({ body: { operationId: '123' }, method: 'post' });
    assert.deepStrictEqual(validator(spec, request, spec), [{
      cursor: 'body:User',
      error: 'Value is missing required keys [id]',
    }]);
  });
});

describe('Given a valid spec with no definitions', () => {
  const spec = {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/definitions/User',
          },
        },
      },
    },
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };

  test('Should return errors for a invalid refs', () => {
    const request = generateRequest({ body: { operationId: '123' }, method: 'post' });
    assert.deepStrictEqual(validator(spec, request), [{
      cursor: 'body',
      error: 'Could not find definition for #/definitions/User',
    }]);
  });
});

describe('Given a valid spec with mixed parameter locations', () => {
  const spec = {
    paths: {
      '/foo/{id}': {
        get: {
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              required: true,
              schema: {
                type: 'string',
              },
            },
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
            200: { description: 'ok' },
          },
        },
      },
    },
  };

  test('Should return no errors for a valid request', () => {
    const request = generateRequest({
      url: '/foo/123',
      params: {
        id: '123',
      },
      headers: {
        authorization: '123',
      },
      method: 'get',
    });
    assert.deepStrictEqual(validator(spec.paths['/foo/{id}'].get, request), []);
  });

  test('Should return errors for an invalid request from path level parameters', () => {
    const request = generateRequest({
      url: '/foo/123',
      params: {
        id: '123',
      },
      headers: {},
      method: 'get',
    });
    assert.deepStrictEqual(validator(spec.paths['/foo/{id}'].get, request), [{
      cursor: 'header.authorization',
      error: 'Value is required and was not provided',
    }]);
  });

  test('Should return all errors, for an invalid request from multiple parameters', () => {
    const request = generateRequest({
      url: '/foo/123',
      params: {
        id: 'abc',
      },
      headers: {},
      method: 'get',
    });
    assert.deepStrictEqual(validator(spec.paths['/foo/{id}'].get, request), [
      { cursor: 'header.authorization', error: 'Value is required and was not provided' },
      { cursor: 'path.id', error: 'Value is not an integer' },
    ]);
  });

  test('Should return errors for an invalid request from method level parameters', () => {
    const request = generateRequest({
      url: '/foo/abc',
      params: {
        id: 'abc',
      },
      headers: {
        authorization: '123',
      },
      method: 'get',
    });
    assert.deepStrictEqual(validator(spec.paths['/foo/{id}'].get, request), [{
      cursor: 'path.id',
      error: 'Value is not an integer',
    }]);
  });
});

describe('Given a valid webhook spec', () => {
  const spec = {
    webhooks: {
      petUpdated: {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    operationId: {
                      type: 'integer',
                      required: true,
                    },
                  },
                },
              },
            },
          },
          operationId: 'getPetById',
          responses: {
            200: { description: 'ok' },
          },
        },
      },
    },
  };

  test('Should return no errors for a valid request', () => {
    const request = generateRequest({
      url: '/',
      body: {
        operationId: '123',
      },
      method: 'post',
    });
    assert.deepStrictEqual(validator(spec.webhooks.petUpdated.post, request), []);
  });

  test('Should return errors for an invalid request', () => {
    const request = generateRequest({
      url: '/',
      body: {
        operationId: 'abc',
      },
      method: 'post',
    });
    assert.deepStrictEqual(validator(spec.webhooks.petUpdated.post, request), [{
      cursor: 'body.operationId',
      error: 'Value is not an integer',
    }]);
  });
});

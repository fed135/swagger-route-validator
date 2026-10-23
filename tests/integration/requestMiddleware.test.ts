import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import { expressRequestValidation } from '../../src/index.ts';

describe('Express app request validation middleware', () => {
  let server;
  let app;
  const port = 10000 + Math.round(Math.random() * 10000);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jsonErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).send({ error: err.message });
  };

  const spec = {
    definitions: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['id'],
      },
    },
    paths: {
      '/user/{id}': {
        get: {
          description: 'Get a User by Id',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'id',
              in: 'path',
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
        delete: {
          description: 'Delete a User by Id',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
              required: true,
            },
            {
              name: 'id',
              in: 'path',
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
        patch: {
          description: 'Patch a user',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'id',
              in: 'path',
              schema: {
                type: 'integer',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/user' },
              },
            },
          },
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
        put: {
          description: 'Patch a user',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'id',
              in: 'path',
              schema: {
                type: 'integer',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/user' },
              },
            },
          },
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
      },
      '/user': {
        post: {
          description: 'Create a user',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/user' },
              },
            },
          },
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
        query: {
          description: 'Search for a user',
          parameters: [
            {
              name: 'authorization',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/definitions/user' },
              },
            },
          },
          responses: {
            default: {
              schema: { $ref: '#/definitions/user' },
              headers: { 'x-request-id': { type: 'string' } },
            },
          },
        },
      },
    },
  };

  beforeEach(() => {
    server = express();
    server.use(express.json());
  });

  afterEach(() => {
    if (app) app.close();
  });

  describe('GET request', () => {
    beforeEach(async () => {
      server.get('/user/:id', expressRequestValidation(spec.paths['/user/{id}'].get, spec), (req, res) => {
        return res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        authorization: 'valid',
      } });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { id: 123, name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/abc`, { headers: {
        authorization: 'valid',
      } });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{\"error\":\"Value is not an integer\",\"cursor\":\"path.id\"}]' });
    });
  });

  describe('POST request', () => {
    beforeEach(async () => {
      server.post('/user', expressRequestValidation(spec.paths['/user'].post, spec), (req, res) => {
        return res.status(200).json({ ok: true });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'POST', body: JSON.stringify({ id: '123', name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { ok: true });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'POST', body: JSON.stringify({ id: 123, name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{"error":"Value is not a string","cursor":"body:user.id"}]' });
    });
  });

  describe('DELETE request', () => {
    beforeEach(async () => {
      server.delete('/user/:id', expressRequestValidation(spec.paths['/user/{id}'].delete, spec), (req, res) => {
        return res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        authorization: 'valid',
      }, method: 'DELETE' });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { id: 123, name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/abc`, { method: 'DELETE' });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{"error":"Value is required and was not provided","cursor":"header.authorization"},{\"error\":\"Value is not an integer\",\"cursor\":\"path.id\"}]' });
    });
  });

  describe('PATCH request', () => {
    beforeEach(async () => {
      server.patch('/user/:id', expressRequestValidation(spec.paths['/user/{id}'].patch, spec), (req, res) => {
        return res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'PATCH', body: JSON.stringify({ id: '123', name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { id: 123, name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'PATCH', body: JSON.stringify({ id: 123, name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{"error":"Value is not a string","cursor":"body:user.id"}]' });
    });
  });

  describe('PUT request', () => {
    beforeEach(async () => {
      server.put('/user/:id', expressRequestValidation(spec.paths['/user/{id}'].put, spec), (req, res) => {
        return res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'PUT', body: JSON.stringify({ id: '123', name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { id: 123, name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user/123`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'PUT', body: JSON.stringify({ id: 123, name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{"error":"Value is not a string","cursor":"body:user.id"}]' });
    });
  });

  describe('QUERY request', () => {
    beforeEach(async () => {
      server.all('/user', expressRequestValidation(spec.paths['/user'].query, spec), (req, res, next) => {
        if (req.method !== 'QUERY') {
          return next();
        }
        return res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
      });

      server.use((req, res) => {
        res.status(404).json({
          error: 'Not found',
        });
      });

      server.use(jsonErrorHandler);

      app = server.listen(port);
      await once(app, 'listening');
    });

    test('should reply with a 200 when sending valid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'QUERY', body: JSON.stringify({ id: '123', name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid parameters', async () => {
      const res = await fetch(`http://localhost:${port}/user`, { headers: {
        'authorization': 'valid',
        'content-type': 'application/json',
      }, method: 'QUERY', body: JSON.stringify({ id: 123, name: 'John Smith', age: 99 }) });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{"error":"Value is not a string","cursor":"body:user.id"}]' });
    });
  });
});

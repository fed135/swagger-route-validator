import { describe, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import { expressRequestValidation } from '../../src/index.ts';

describe('Express app', () => {
  let server;
  let app;
  const port = 10000 + Math.round(Math.random() * 10000);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jsonErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).send({ error: err.message });
  };

  const authenticationMiddleware = (req, res, next) => {
    if (req.headers.authorization !== 'valid') {
      return res.status(401).json({ error: 'Invalid authorization' });
    }
    next();
  };

  const spec = {
    definitions: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true },
          name: { type: 'string' },
          age: { type: 'number' },
        },
      },
    },
    paths: {
      '/foo/{id}': {
        parameters: [
          {
            name: 'authorization',
            in: 'header',
            required: true,
            type: 'string',
          },
        ],
        get: {
          description: 'Get a User by Id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              type: 'integer',
            },
          ],
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
  });

  afterEach(() => {
    if (app) app.close();
  });

  describe('with a request validation', () => {
    beforeEach(async () => {
      server.get('/foo/:id', authenticationMiddleware, expressRequestValidation(spec.paths['/foo/{id}'].get, spec), (req, res) => {
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

    test('should reply with a 200 when sending valid path parameters', async () => {
      const res = await fetch(`http://localhost:${port}/foo/123`, { headers: {
        authorization: 'valid',
      } });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 200);
      assert.deepStrictEqual(response, { id: 123, name: 'John Smith', age: 99 });
    });

    test('should reply with a 400 when sending invalid path parameters', async () => {
      const res = await fetch(`http://localhost:${port}/foo/abc`, { headers: {
        authorization: 'valid',
      } });
      const { status } = res;
      const response = await res.json();

      assert.strictEqual(status, 400);
      assert.deepStrictEqual(response, { error: 'Request object does not match the specification for this route: [{\"error\":\"Value is not an integer\",\"cursor\":\"path.id\"}]' });
    });
  });
});

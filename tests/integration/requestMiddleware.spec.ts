import express from 'express';
import { expressRequestValidation } from '../../src';
import { request } from 'undici';

describe('Express app', () => {
    let server;
    let app;
    const port = 10000 + Math.round(Math.random() * 10000);
    const jsonErrorHandler = (err, req, res, next) => {
        res.status(err.statusCode || 500).send({ error: err.message });
    }

    const authenticationMiddleware = (req, res, next) => {
      if (req.headers.authorization !== 'valid') {
        return res.status(401).json({ error: 'Invalid authorization' });
      }
      next();
    }

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
                        type: 'string'
                    }
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
                            headers: { 'x-request-id': { type: 'string' } }
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
      beforeEach((done) => {
        server.get('/foo/:id', authenticationMiddleware, expressRequestValidation(spec.paths['/foo/{id}'].get, spec), (req, res, next) => {
          res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
          return next();
        });

        server.use((req, res, next) => {
            res.status(404).json({
                error: 'Not found',
            });
        });

        server.use(jsonErrorHandler);
  
        app = server.listen(port, (err) => {
          if (err) throw err;
          done();
        });
      });
  
      test('should reply with a 200 when sending valid path parameters', async () => {
        const {
          statusCode,
          body,
        } = await request(`http://localhost:${port}/foo/123`, { headers: {
            authorization: 'valid',
        }});
        const response = await body.json();
  
        expect(statusCode).toEqual(200);
        expect(response).toEqual({ id: '123', name: 'John Smith', age: 99 });
      });

      test('should reply with a 400 when sending invalid path parameters', async () => {
        const {
          statusCode,
          body,
        } = await request(`http://localhost:${port}/foo/abc`, { headers: {
            authorization: 'valid',
        }});
        const response = await body.json();
  
        expect(statusCode).toEqual(400);
        expect(response).toEqual({ error: 'Request object does not match the specification for this route: [{\"error\":\"Value is not an integer\",\"cursor\":\"path.id\"}]' });
      });
    });
});
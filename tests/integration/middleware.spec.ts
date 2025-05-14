import express from 'express';
import { expressRequestValidation, expressResponseValidation } from '../../src';
import { request } from 'undici';

describe('Express app', () => {
    let server;
    let app;
    const port = 10000 + Math.round(Math.random() * 10000);
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
            '/foo': {
                get: {
                    description: 'Get a User by Id',
                    parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        type: 'string',
                    },
                    ],
                    responses: {
                        default: { schema: { $ref: '#/definitions/user' } },
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
        server.get('/foo/:id', expressRequestValidation(spec.paths['/foo'].get, spec), (req, res, next) => {
          res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
          return next();
        });
  
        app = server.listen(port, (err) => {
          if (err) throw err;
          done();
        });
      });
  
      test('should reply with a 200 when sending valid path parameters', async () => {
        const {
          statusCode,
          body,
        } = await request(`http://localhost:${port}/foo/123`);
        const response = await body.json();
  
        expect(statusCode).toEqual(200);
        expect(response).toEqual({ id: '123', name: 'John Smith', age: 99 });
      });
    });

    describe('with a response validation', () => {
        beforeEach((done) => {
          server.get('/foo/:id', expressResponseValidation(spec.paths['/foo'].get, {behavior: 'error'}, spec), (req, res, next) => {
            res.status(200).json({ id: req.params.id, name: 'John Smith', age: 99 });
            return next();
          });
    
          app = server.listen(port, (err) => {
            if (err) throw err;
            done();
          });
        });
    
        test('should reply with a 200 when sending valid path parameters', async () => {
          const {
            statusCode,
            body,
          } = await request(`http://localhost:${port}/foo/123`);

          const response = await body.json();
    
          expect(statusCode).toEqual(200);
          expect(response).toEqual({ id: '123', name: 'John Smith', age: 99 });
        });
      });
});
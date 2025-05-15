import * as OpenApiValidator from 'express-openapi-validator';
import express from 'express';

const app = express();
app.use(express.json());

app.use(
    OpenApiValidator.middleware({
      apiSpec: {
        openapi: '3.0.1',
        info: {
            title: 'Test api',
            version: '0.0.0',
        },
        servers: [],
        paths: {
            '/pets/{id}': {
                get: {
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
                        200: { description: 'ok' },
                      },
                }
            }
        },
      },
      validateRequests: true,
    }),
  );

app.get('/pets/:id', (req, res) => res.status(200).json({ result: 'ok', id: req.params.id }));
app.get('*path', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9003);

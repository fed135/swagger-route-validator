const swagger = require('sway');
const express = require('express');

const app = express();
let api;
app.use(express.json());
app.use((req, res, next) => {
  const validation = api.getOperation(req).validateRequest(req);
    
  if (validation.errors.length && !req.error) {
    return res.status(400).json(validation.errors);
  }
  next()
});

const handlers = {
  // your platform specific request handlers here
  getPets: (req, res) => res.status(200).json({ result: 'ok' }),
  getPetById: (req, res) => res.status(200).json({ result: 'ok' }),
  notFound: (req, res) => res.status(404).json({ err: 'not found' }),
}

swagger.create({ definition: {
  paths: {
    '/pets': {
      get: {
        operationId: 'getPets',
        responses: {
          200: { description: 'ok' },
        },
      },
    },
    '/pets/{id}': {
      get: {
        operationId: 'getPetById',
        responses: {
          200: { description: 'ok' },
        },
      },
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
    },
  },
} })
  .then((_api) => {
    api = _api;
    api.pathObjects.forEach((pathDef) => {
      app.get(pathDef.regexp, handlers[pathDef.get.operationId])
    });

    app.listen(9000);
  });
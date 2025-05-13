import srv from '../src/validator';
import express from 'express';

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
    200: { description: 'ok' },
  },
};

const app = express();
app.use(express.json());

function validateRequest(spec) {
  return (req, res, next) => {
    const errors = srv(spec, req);
    if (errors.length > 0) return res.status(400).json(errors);

    next();
  };
}

app.get('/pets/:id', validateRequest(spec), (req, res) => res.status(200).json({ result: 'ok', id: req.params.id }));
app.get('*', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9000);

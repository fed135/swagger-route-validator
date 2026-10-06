import { expressRequestValidation as srv } from '../src/index.ts';
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

app.get('/pets/:id', srv(spec), (req, res) => res.status(200).json({ result: 'ok', id: req.params.id }));
app.get('*path', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9001);

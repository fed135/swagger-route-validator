import { validateRoute } from 'express-ajv-middleware';
import express from 'express';

const spec = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
    },
    required: ['id'],
  },
};

const app = express();
app.use(express.json());

app.get('/pets/:id', validateRoute(spec), (req, res) => res.status(200).json({ result: 'ok', id: req.params.id }));
app.get('*', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9000);

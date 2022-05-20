const Ajv = require('ajv');
const express = require('express');

const validator = new Ajv();

const spec = {
  '/pets/:id': {
    get: {
      params: {
        type: 'object',
        properties: {
          id: {
            required: true,
            type: 'integer',
          },
        },
        required: ['id'],
      },
    },  
  },
  '/pets': {
    get: {},
  },
};

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const layer = app._router.stack.find(bloc => bloc.route && bloc.regexp.exec(req.originalUrl) !== null);
    
  // Check if route exists
  if (!layer) return next();

  // prevents routing from running twice:
  req.route = layer.route;

  function extractPathParams(url, layer) {
    const parameters = {};

    if (layer.keys.length > 0) {
      const cleanedInbound = url.split('/');
      const cleanedOriginal = layer.route.path.split('/');
      let keysIndex = 0;
      for (let i = 0; i < cleanedInbound.length; i++) {
        if (!layer.keys[keysIndex]) continue;
        if (cleanedInbound[i] !== cleanedOriginal[i]) {
          parameters[layer.keys[keysIndex].name] = cleanedInbound[i];
          keysIndex++;
        }
      }
    }
    return parameters;
  }

  const matchingSpec = spec[layer.route.path] && spec[layer.route.path][req.method.toLowerCase()];
    
  // Path not in specs
  if (!matchingSpec) return next();

  Object.assign(req.params, extractPathParams(req.originalUrl, layer));

  // Check validation errors
  const errors = validator.validate(matchingSpec, req);
  if (errors.length > 0) return res.status(400).json(errors);

  next();
});

app.get('/pets/:id', (req, res) => res.status(200).json({ result: 'ok', id: req.params.id }));
app.get('/pets', (req, res) => res.status(200).json({ result: 'ok' }));
app.get('*', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9000);

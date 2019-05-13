const srv = require('../src/validator');
const express = require('express');

const spec = {
    '/pets/:id': {
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
        },  
    },
    '/pets': {
        get: {
          operationId: 'getPets',
          responses: {
            200: { description: 'ok' },
          },
        },
    },
};

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    const route = app._router.stack.find(bloc => bloc.route && bloc.regexp.exec(req.originalUrl) !== null);
    
    // Check if route exists
    if (!route) return next();

    function extractPathParams(url, route) {
        const parameters = {};

        if (route.keys.length > 0) {
            const cleanedInbound = url.split('/');
            const cleanedOriginal = route.route.path.split('/');
            let keysIndex = 0;
            for (let i = 0; i < cleanedInbound.length; i++) {
                if (!route.keys[keysIndex]) continue;
                if (cleanedInbound[i] !== cleanedOriginal[i]) {
                    parameters[route.keys[keysIndex].name] = cleanedInbound[i];
                    keysIndex++;
                }
            }
        }
        return parameters;
    }

    const matchingSpec = spec[route.route.path] && spec[route.route.path][req.method.toLowerCase()];
    
    // Path not in specs
    if (!matchingSpec) return next();

    Object.assign(req.params, extractPathParams(req.originalUrl, route));

    // Check validation errors
    const errors = srv(matchingSpec, req);
    if (errors.length > 0) return res.status(400).json(errors);

    next();
});

app.get('/pets/:id', (req, res) => res.status(200).json({ result: 'ok' }));
app.get('/pets', (req, res) => res.status(200).json({ result: 'ok' }));
app.get('*', (req, res) => res.status(404).json({ err: 'not found' }));
app.listen(9000);

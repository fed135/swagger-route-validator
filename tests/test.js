const validator = require('../src/validator');
const spec = {
    params: [{
            name: 'recordActivity',
            in: 'query',
            description: 'Updates the recent activity data',
            type: 'boolean',
            default: false
          },
          {
              name: 'ids',
              in: 'query',
              description: 'List of ids to fetch',
              type: 'array',
              items: {
                type: 'string'
              },
              minItems: 1,
              maxItems: 100,
              required: true
          },
        {
            name: 'body',
            in: 'body',
            description: 'the payload for something',
            type: 'object',
            required: true,
            properties: {
                foo: {
                    type: 'string',
                    enum: ['bar'],
                    default: 'bar'
                }
            }
        }]
}

const req = {
    query: {
        recordActivity: true,
        ids: ['a',2,'c']
    },
    body: {
        
    }
};

console.log(validator(spec, req))
console.log(req);
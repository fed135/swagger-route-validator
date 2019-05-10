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
};

const req = {
  query: {
    recordActivity: true
  },
  body: {}
};

console.log(validator(spec, req));
console.log(req);

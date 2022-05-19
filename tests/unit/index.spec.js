const validator = require('../../src/validator');

describe('Given a valid spec with path parameters', () => {
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

  it('Should return return no errors for a valid data type', () => {
    const request = {
      url: '/',
      params: {
        id: '123',
      },
    };
    expect(validator(spec, request)).toEqual([]);
  });

  it('Should return return errors for an invalid data type', () => {
    const request = {
      url: '/',
      params: {
        id: 'abc',
      },
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'path.id',
      error: 'Value is not an integer',
    }]);
  });
});

describe('Given a valid spec with header parameters', () => {
  const spec = {
    parameters: [
      {
        name: 'authorization',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        name: 'x-request-id',
        in: 'headers',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };
  
  it('Should return return no errors for a valid data type', () => {
    const request = {
      url: '/',
      headers: {
        authorization: '123',
        'x-request-id': '456',
      },
    };
    expect(validator(spec, request)).toEqual([]);
  });
  
  it('Should return return errors for missin fields', () => {
    const request = {
      url: '/',
      headers: {},
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'headers.authorization',
      error: 'Value for authorization is required and was not provided',
    },
    {
      cursor: 'headers.x-request-id',
      error: 'Value for x-request-id is required and was not provided',
    }]);
  });
});

describe('Given a valid spec with query parameters', () => {
  const spec = {
    parameters: [
      {
        name: 'userId',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };
  
  it('Should return return no errors for a valid data type', () => {
    const request = {
      url: '/',
      query: {
        userId: '123',
      },
    };
    expect(validator(spec, request)).toEqual([]);
  });
  
  it('Should return return errors for missin fields', () => {
    const request = {
      url: '/',
      headers: {},
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'query.userId',
      error: 'Value for userId is required and was not provided',
    }]);
  });
});

describe('Given a valid spec with body parameters', () => {
  const spec = {
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: true,
        schema: {
          type: 'object',
          properties: {
            operationId: {
              type: 'string',
              required: true,
            },
          },
        },
      },
    ],
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };
  
  it('Should return return no errors for a valid data type', () => {
    const request = {
      url: '/',
      body: {
        operationId: '123',
      },
    };
    expect(validator(spec, request)).toEqual([]);
  });
  
  it('Should return return errors for missin fields', () => {
    const request = {
      url: '/',
      body: {
        foo: 'abc',
      },
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'body.operationId',
      error: 'Value for operationId is required and was not provided',
    }]);
  });
});

describe('Given a valid spec with definitions', () => {
  const spec = {
    definitions: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            required: true,
          },
        },
      }, 
    },
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/User',
        },
      },
    ],
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };
  
  it('Should return return no errors for a valid ref', () => {
    const request = {
      url: '/',
      body: {
        id: '123',
      },
    };
    expect(validator(spec, request)).toEqual([]);
  });

  it('Should return return an errors for an existing but incorrect ref', () => {
    const request = {
      url: '/',
      body: {
        operationId: '123',
      },
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'body:User.id',
      error: 'Value for id is required and was not provided',
    }]);
  });
});


describe('Given a valid spec with no definitions', () => {
  const spec = {
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/User',
        },
      },
    ],
    operationId: 'getPetById',
    responses: {
      200: { description: 'ok' },
    },
  };
  
  it('Should return return errors for a invalid refs', () => {
    const request = {
      url: '/',
      body: {
        operationId: '123',
      },
    };
    expect(validator(spec, request)).toEqual([{
      cursor: 'body',
      error: 'Could not find definition for #/definitions/User',
    }]);
  });
});

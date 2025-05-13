import {validateRequest as validator} from '../../src/request';

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

const badSpec = {
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'bad-type',
      },
    },
  ],
  operationId: 'getPetById',
  responses: {
    200: { description: 'ok' },
  },
};

const request = {
  url: '/',
  params: {
    id: '123',
  },
};

test('valid spec', () => {
  expect(validator(spec, request).length).toBe(0);
});

test('invalid spec', () => {
  expect(validator.bind(null, badSpec, request)).toThrow('a');
});

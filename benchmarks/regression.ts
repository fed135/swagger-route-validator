import { bench, suite } from 'node:bench';
import { validate as srv } from '../src/index.ts';
// import Ajv from 'ajv';
// import addFormats from "ajv-formats";

const spec = {
  type: 'object',
  properties: {
    fooInt: { type: 'integer' },
    fooNum: { type: 'number' },
    fooString: { type: 'string' },
    fooBool: { type: 'boolean' },
    fooIP4: { type: 'string', format: 'ipv4' },
    fooURI: { type: 'string', format: 'uri' },
    fooUUID: { type: 'string', format: 'uuid' },
    fooObj: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 3 },
      },
      required: ['id', 'name'],
    },
    fooList: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
};

suite('Performance regression bench', () => {
  bench('srv', { samples: 100 }, async (b) => {
    const errorAccumulator = [];

    b.start();
    for (let i = 0; i < 0xffff; i++) {
      errorAccumulator.push.apply(errorAccumulator, srv(spec, {
        fooInt: i,
        fooNum: i / 2,
        fooString: `${i} !!`,
        fooBool: i % 2 === 0,
        fooIP4: '0.0.0.0',
        fooURI: 'https://github.com',
        fooUUID: 'f37bfdec-bdda-4c07-9ba9-09f99885a5ff',
        fooObj: {
          id: i * 2,
          name: `user_${i}`,
        },
        fooList: `a,b,c,${i}`,
      }));
    }
    b.end(0xffff);
  });
});

/*
  bench('ajv', { samples: 100 }, async (b) => {

    const errorAccumulator = [];

    b.start();
    for (let i = 0; i < 0xffff; i++) {
      const ajv = new Ajv();
      addFormats(ajv);
      const validator = ajv.compile(spec);
      if (!validator(spec, {
        fooInt: i,
        fooNum: i / 2,
        fooString: `${i} !!`,
        fooBool: i % 2 === 0,
        fooIP4: '0.0.0.0',
        fooURI: 'https://github.com',
        fooUUID: 'f37bfdec-bdda-4c07-9ba9-09f99885a5ff',
        fooObj: {
          id: i * 2,
          name: `user_${i}`,
        },
      })) errorAccumulator.push.apply(errorAccumulator, validator.errors);
    }
    b.end(0xffff);
  });
});
*/

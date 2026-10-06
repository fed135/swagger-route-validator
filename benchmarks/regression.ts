import { bench, suite } from 'node:bench';
import { validate } from '../src/index.ts';

suite('Performance regression bench', () => {
  bench('deep spec', { samples: 100 }, async (b) => {
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
      },
    };

    const errorAccumulator = [];

    b.start();
    for (let i = 0; i < 0xffff; i++) {
      errorAccumulator.push.apply(errorAccumulator, validate(spec, {
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
      }));
    }
    b.end(0xffff);
  });
});

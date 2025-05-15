import {makeError} from '../../../src/error';

test('error formatting', () => {
  expect(makeError('a.b.c', { foo: 'bar' }, 'This is an error')).toStrictEqual({ cursor: 'a.b.c', error: 'This is an error' });
});
